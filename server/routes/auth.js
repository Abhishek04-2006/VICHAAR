const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Apne database connection pool ko import karein:
// DHYAN DEIN: Agar db promise-based nahi hai toh mysql2/promise wala connection hona chahiye
const db = require('../config/db'); 

// 1. Standard Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.insertId, email, name },
      process.env.JWT_SECRET || 'vichaar_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: result.insertId, name, email }
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// 2. Standard Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'vichaar_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// 3. Google OAuth Endpoint (/api/auth/google)
router.post('/google', async (req, res) => {
  const { name, email, avatar, googleId } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required from Google.' });
  }

  try {
    // 1. Check if user already exists
    const [existing] = await db.query('SELECT id, name, email FROM users WHERE email = ?', [email]);
    
    let user;
    if (existing.length > 0) {
      user = existing[0];
    } else {
      // 2. Auto-register new OAuth user with high entropy random hash
      const dummyPasswordHash = await bcrypt.hash(`oauth_${Date.now()}_${Math.random()}`, 10);
      const [insertResult] = await db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name || 'Campus Thinker', email, dummyPasswordHash]
      );
      user = { id: insertResult.insertId, name: name || 'Campus Thinker', email };
    }

    // 3. Issue JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'vichaar_secret_key',
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Google Auth Route Error:', err);
    return res.status(500).json({ error: 'Database error during Google OAuth sync.' });
  }
});

module.exports = router;