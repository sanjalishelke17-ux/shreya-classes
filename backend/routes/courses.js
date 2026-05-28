const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/courses — public
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses WHERE is_active=true ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/courses/:id — public
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Course not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/courses — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, description, subjects, fees_monthly, fees_yearly, duration, batch_size, badge, popular } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO courses (name,description,subjects,fees_monthly,fees_yearly,duration,batch_size,badge,popular)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, description, subjects, fees_monthly, fees_yearly, duration, batch_size, badge, popular]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/courses/:id — admin only (update fees etc.)
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { name, description, subjects, fees_monthly, fees_yearly, duration, batch_size, badge, popular, is_active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE courses SET name=$1,description=$2,subjects=$3,fees_monthly=$4,fees_yearly=$5,
       duration=$6,batch_size=$7,badge=$8,popular=$9,is_active=$10
       WHERE id=$11 RETURNING *`,
      [name, description, subjects, fees_monthly, fees_yearly, duration, batch_size, badge, popular, is_active, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Course not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/courses/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await pool.query('UPDATE courses SET is_active=false WHERE id=$1', [req.params.id]);
    res.json({ message: 'Course deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
