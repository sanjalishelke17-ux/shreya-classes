const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const pool    = require('../config/db');

const makeToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, phone, password, class_enrolled } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email and password are required.' });
  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email.toLowerCase().trim()]);
    if (existing.rows.length)
      return res.status(409).json({ message: 'An account with this email already exists.' });

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, role, class_enrolled)
       VALUES ($1,$2,$3,$4,'student',$5)
       RETURNING id, name, email, role, class_enrolled, phone`,
      [name.trim(), email.toLowerCase().trim(), phone, hash, class_enrolled]
    );
    const user = result.rows[0];
    res.status(201).json({ token: makeToken(user), user });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, role, class_enrolled, password_hash, is_active
       FROM users WHERE email=$1`,
      [email.toLowerCase().trim()]
    );
    const user = result.rows[0];
    if (!user)
      return res.status(401).json({ message: 'No account found with this email.' });
    if (!user.is_active)
      return res.status(403).json({ message: 'Account is deactivated. Contact admin.' });

    // Try bcryptjs first (for students registered via API)
    let match = false;
    try {
      match = await bcrypt.compare(password, user.password_hash);
    } catch (_) {
      match = false;
    }

    // If bcryptjs fails, try pgcrypto verification (for admin created via SQL)
    if (!match) {
      try {
        const pgCheck = await pool.query(
          `SELECT (password_hash = crypt($1, password_hash)) AS match FROM users WHERE id=$2`,
          [password, user.id]
        );
        match = pgCheck.rows[0]?.match === true;
      } catch (_) {
        match = false;
      }
    }

    if (!match)
      return res.status(401).json({ message: 'Incorrect password.' });

    const { password_hash, ...safeUser } = user;
    res.json({ token: makeToken(safeUser), user: safeUser });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/setup-admin  — run once to fix admin password if needed
router.post('/setup-admin', async (req, res) => {
  const { secret } = req.body;
  if (secret !== 'shreya_setup_2024')
    return res.status(403).json({ message: 'Invalid setup secret.' });
  try {
    const hash = await bcrypt.hash('Admin@1234', 10);
    await pool.query(
      `UPDATE users SET password_hash=$1 WHERE email='admin@shreyaclasses.com'`,
      [hash]
    );
    res.json({ message: 'Admin password reset to Admin@1234 successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed: ' + err.message });
  }
});

module.exports = router;
