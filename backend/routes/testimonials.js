const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/testimonials/approved — public
router.get('/approved', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM testimonials WHERE is_approved=true ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/testimonials — admin sees all including unapproved
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/testimonials — public submission
router.post('/', async (req, res) => {
  const { student_name, year, percentage, stream, review, rating } = req.body;
  if (!student_name || !review || !percentage) {
    return res.status(400).json({ message: 'Name, review, and percentage are required.' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO testimonials (student_name,year,percentage,stream,review,rating,is_approved)
       VALUES ($1,$2,$3,$4,$5,$6,false) RETURNING *`,
      [student_name, year, percentage, stream, review, rating || 5]
    );
    res.status(201).json({ message: 'Submitted for approval.', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/testimonials/:id/approve — admin approves
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE testimonials SET is_approved=true WHERE id=$1 RETURNING *',
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/testimonials/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM testimonials WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
