const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/admissions — public
router.post('/', async (req, res) => {
  const { name, phone, email, class: cls, school, subjects, message } = req.body;
  if (!name || !phone) return res.status(400).json({ message: 'Name and phone required.' });
  try {
    const result = await pool.query(
      `INSERT INTO admissions (name,phone,email,class,school,subjects,message)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, phone, email, cls, school, subjects, message]
    );
    res.status(201).json({ message: 'Application submitted! We will contact you within 24 hours.', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admissions — admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM admissions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admissions/:id — admin updates status
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE admissions SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
