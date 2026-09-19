const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const auth = require('./authMiddleware');

router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    const userId = result.insertId;

    const token = jwt.sign({ id: userId, email, role: 'USER' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User registered successfully', token, user: { id: userId, name, email, role: 'USER' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login Successful', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/auth/me', auth, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/posts', async (req, res) => {
  try {
    const { category } = req.query;
    let queryText = `
      SELECT
        p.id,
        p.title,
        p.content,
        p.category,
        p.created_at,
        u.name AS author_name,
        u.id AS author_id,
        CAST(COALESCE(SUM(CASE WHEN v.vote_type = 'UP' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS upvotes,
        CAST(COALESCE(SUM(CASE WHEN v.vote_type = 'DOWN' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS downvotes,
        COUNT(DISTINCT c.id) AS comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN votes v ON p.id = v.post_id
      LEFT JOIN comments c ON p.id = c.post_id
    `;
    const queryParams = [];

    if (category) {
      queryText += ' WHERE p.category = ?';
      queryParams.push(category);
    }
    queryText += ' GROUP BY p.id, u.name, u.id ORDER BY p.created_at DESC';

    const [posts] = await db.query(queryText, queryParams);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/posts', auth, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required.' });
    }
    const [result] = await db.query('INSERT INTO posts (user_id, title, content, category) VALUES (?,?,?,?)', [req.user.id, title, content, category]);
    const [newPost] = await db.query('SELECT * FROM posts WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Post created successfully', post: newPost[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const [posts] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);
    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    if (posts[0].user_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to delete this post.' });
    }
    await db.query('DELETE FROM posts WHERE id = ?', [postId]);
    res.json({ message: 'Post deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/posts/:id/vote', auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { voteType } = req.body;
    if (!['UP', 'DOWN'].includes(voteType)) {
      return res.status(400).json({ error: 'Vote type must be UP or DOWN.' });
    }
    const [existingVotes] = await db.query('SELECT id, vote_type FROM votes WHERE post_id = ? AND user_id = ?', [postId, userId]);
    if (existingVotes.length > 0) {
      const currentVote = existingVotes[0];
      if (currentVote.vote_type === voteType) {
        await db.query('DELETE FROM votes WHERE id = ?', [currentVote.id]);
        return res.json({ message: 'Vote removed' });
      } else {
        await db.query('UPDATE votes SET vote_type = ? WHERE id = ?', [voteType, currentVote.id]);
        return res.json({ message: 'Vote updated' });
      }
    } else {
      await db.query('INSERT INTO votes (post_id, user_id, vote_type) VALUES (?,?,?)', [postId, userId, voteType]);
      return res.status(201).json({ message: 'Vote recorded' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single clean comments retrieval endpoint
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id;
    const query = `
      SELECT c.id, c.content, c.created_at, u.name AS author_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `;
    const [comments] = await db.query(query, [postId]);
    return res.status(200).json({ comments });
  } catch (err) {
    console.error('Error fetching comments:', err);
    return res.status(500).json({ error: 'Failed to fetch comments.' });
  }
});

// Single clean comment submission endpoint
router.post('/posts/:id/comments', auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty.' });
    }

    const insertQuery = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
    const [result] = await db.query(insertQuery, [postId, userId, content.trim()]);

    const [newComment] = await db.query(
      `SELECT c.id, c.content, c.created_at, u.name AS author_name 
       FROM comments c JOIN users u ON c.user_id = u.id 
       WHERE c.id = ?`,
      [result.insertId]
    );

    return res.status(201).json({ comment: newComment[0] });
  } catch (err) {
    console.error('Error creating comment:', err);
    return res.status(500).json({ error: 'Failed to post comment.' });
  }
});

module.exports = router;