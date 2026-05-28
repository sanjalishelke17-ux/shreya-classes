const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
const bcrypt  = require('bcryptjs');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/students — admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id,name,email,phone,role,class_enrolled,is_active,created_at
       FROM users WHERE role='student' ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/students/me — logged-in student's own profile
router.get('/me', protect, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id,name,email,phone,class_enrolled,created_at FROM users WHERE id=$1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/students/me — student updates own profile
router.put('/me', protect, async (req, res) => {
  const { name, phone } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name=$1, phone=$2, updated_at=NOW() WHERE id=$3 RETURNING id,name,email,phone,class_enrolled',
      [name, phone, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/students/me/password — student changes own password
router.put('/me/password', protect, async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ message: 'Both current and new password required.' });
  }
  try {
    const result = await pool.query('SELECT password_hash FROM users WHERE id=$1', [req.user.id]);
    const match = await bcrypt.compare(current_password, result.rows[0].password_hash);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect.' });
    const hash = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, req.user.id]);
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/students/:id — admin updates student
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { name, phone, class_enrolled, is_active } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name=$1,phone=$2,class_enrolled=$3,is_active=$4 WHERE id=$5 RETURNING id,name,email,phone,class_enrolled,is_active',
      [name, phone, class_enrolled, is_active, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/students/:id — admin deactivates student
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await pool.query('UPDATE users SET is_active=false WHERE id=$1', [req.params.id]);
    res.json({ message: 'Student deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
