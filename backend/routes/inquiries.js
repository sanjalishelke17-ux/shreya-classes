const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/inquiries — public (anyone can submit)
router.post('/', async (req, res) => {
  const { name, phone, email, class: cls, subject, message } = req.body;
  if (!name || !phone) return res.status(400).json({ message: 'Name and phone are required.' });
  try {
    const result = await pool.query(
      `INSERT INTO inquiries (name,phone,email,class,subject,message)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, phone, email, cls, subject, message]
    );
    res.status(201).json({ message: 'Inquiry received. We will contact you soon.', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/inquiries — admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    let q = 'SELECT * FROM inquiries';
    const params = [];
    if (status) { q += ' WHERE status=$1'; params.push(status); }
    q += ' ORDER BY created_at DESC';
    const result = await pool.query(q, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/inquiries/:id — admin updates status/notes
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { status, notes } = req.body;
  try {
    const result = await pool.query(
      'UPDATE inquiries SET status=$1, notes=$2 WHERE id=$3 RETURNING *',
      [status, notes, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/inquiries/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM inquiries WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
