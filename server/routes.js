const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const auth = require('./authMiddleware');

// 1. Standard Register
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
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
      'INSERT INTO users (name, email, password, department, badge) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, department || 'BCA', 'STUDENT']
    );
    const userId = result.insertId;

    const token = jwt.sign(
      { id: userId, email, role: 'USER' },
      process.env.JWT_SECRET || 'vichaar_secret_key',
      { expiresIn: '7d' }
    );
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email, role: 'USER', department: department || 'BCA', badge: 'STUDENT' }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Standard Login
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

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'vichaar_secret_key',
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Login Successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        badge: user.badge
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Google OAuth Endpoint (/api/auth/google)
router.post('/auth/google', async (req, res) => {
  const { name, email, avatar, googleId } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required from Google.' });
  }

  try {
    const [existingUsers] = await db.query(
      'SELECT id, name, email, role, department, badge FROM users WHERE email = ?',
      [email]
    );

    let user;
    if (existingUsers.length > 0) {
      user = existingUsers[0];
    } else {
      const dummyPasswordHash = await bcrypt.hash(`oauth_${Date.now()}_${Math.random()}`, 10);
      const [insertResult] = await db.query(
        'INSERT INTO users (name, email, password, department, badge) VALUES (?, ?, ?, ?, ?)',
        [name || 'Campus Thinker', email, dummyPasswordHash, 'BCA', 'STUDENT']
      );
      user = {
        id: insertResult.insertId,
        name: name || 'Campus Thinker',
        email,
        role: 'USER',
        department: 'BCA',
        badge: 'STUDENT'
      };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role || 'USER' },
      process.env.JWT_SECRET || 'vichaar_secret_key',
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'USER',
        department: user.department,
        badge: user.badge,
        avatar: avatar || null
      }
    });
  } catch (err) {
    console.error('Google OAuth Error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// 4. Current User Session Check
   router.get('/auth/me', auth, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, department, badge, avatar, bio, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT /api/users/profile (Update avatar, bio, department)
   router.put('/users/profile', auth, async (req, res) => {
  try {
    const { avatar, bio, department } = req.body;
    const userId = req.user.id;

    await db.query(
      `UPDATE users 
       SET avatar = COALESCE(?, avatar), 
           bio = COALESCE(?, bio), 
           department = COALESCE(?, department) 
       WHERE id = ?`,
      [avatar || null, bio || null, department || null, userId]
    );

    const [updated] = await db.query(
      'SELECT id, name, email, role, department, badge, avatar, bio FROM users WHERE id = ?',
      [userId]
    );

   return res.json({ message: 'Profile updated successfully', user: updated[0] });
  } catch (err) {
    console.error('Update Profile Error:', err);
   return res.status(500).json({ error: err.message });
  }
});

// 5. Posts Feed & Category Filters (with Debounced Full-Text Search)
router.get('/posts', async (req, res) => {
  try {
    const { category, search } = req.query;
    let queryText = `
      SELECT
        p.id,
        p.title,
        p.content,
        p.category,
        p.created_at,
        u.name AS author_name,
        u.id AS author_id,
        u.department AS author_department,
        u.badge AS author_badge,
        CAST(COALESCE(SUM(CASE WHEN v.vote_type = 'UP' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS upvotes,
        CAST(COALESCE(SUM(CASE WHEN v.vote_type = 'DOWN' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS downvotes,
        COUNT(DISTINCT c.id) AS comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN votes v ON p.id = v.post_id
      LEFT JOIN comments c ON p.id = c.post_id
    `;
    const conditions = [];
    const queryParams = [];

    if (category && category !== 'All') {
      conditions.push('p.category = ?');
      queryParams.push(category);
    }

    if (search && search.trim() !== '') {
      conditions.push('MATCH(p.title, p.content) AGAINST(? IN NATURAL LANGUAGE MODE)');
      queryParams.push(search.trim());
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += ' GROUP BY p.id, u.name, u.id, u.department, u.badge ORDER BY p.created_at DESC';

    const [posts] = await db.query(queryText, queryParams);
    res.json(posts);
  } catch (err) {
    console.error('Fetch Posts Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Recommended Real Users Widget Endpoint
router.get('/users/recommended', async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT 
        u.id, 
        u.name, 
        u.badge, 
        u.department, 
        COUNT(p.id) AS post_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      GROUP BY u.id, u.name, u.badge, u.department
      ORDER BY post_count DESC, u.id ASC
      LIMIT 5
    `);
    res.json(users);
  } catch (err) {
    console.error('Fetch Recommended Users Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7. Create Post
router.post('/posts', auth, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required.' });
    }
    const [result] = await db.query(
      'INSERT INTO posts (user_id, title, content, category) VALUES (?, ?, ?, ?)',
      [req.user.id, title, content, category]
    );
    const [newPost] = await db.query('SELECT * FROM posts WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Post created successfully', post: newPost[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Delete Post
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

// 9. Post Upvote / Downvote Toggle
router.post('/posts/:id/vote', auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { voteType } = req.body;
    if (!['UP', 'DOWN'].includes(voteType)) {
      return res.status(400).json({ error: 'Vote type must be UP or DOWN.' });
    }
    const [existingVotes] = await db.query(
      'SELECT id, vote_type FROM votes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
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
      await db.query(
        'INSERT INTO votes (post_id, user_id, vote_type) VALUES (?, ?, ?)',
        [postId, userId, voteType]
      );
      return res.status(201).json({ message: 'Vote recorded' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Fetch Post Comments
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

// 11. Post a Comment
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
// PUT /api/users/profile
router.put('/users/profile', auth, async (req, res) => {
  try {
    const { avatar, bio, department } = req.body;
    const userId = req.user.id;

    await db.query(
      `UPDATE users 
       SET avatar = COALESCE(?, avatar), 
           bio = COALESCE(?, bio), 
           department = COALESCE(?, department) 
       WHERE id = ?`,
      [avatar || null, bio || null, department || null, userId]
    );

    const [updated] = await db.query(
      'SELECT id, name, email, role, department, badge, avatar, bio FROM users WHERE id = ?',
      [userId]
    );

    return res.json({ message: 'Profile updated successfully', user: updated[0] });
  } catch (err) {
    console.error('Update Profile Error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/users/recommended
router.get('/users/recommended', async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT 
        u.id, 
        u.name, 
        u.badge, 
        u.department, 
        u.avatar,
        COUNT(p.id) AS post_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      GROUP BY u.id, u.name, u.badge, u.department, u.avatar
      ORDER BY post_count DESC, u.id ASC
      LIMIT 5
    `);
    return res.json(users);
  } catch (err) {
    console.error('Fetch Recommended Users Error:', err);
    return res.status(500).json({ error: err.message });
  }
});
module.exports = router;