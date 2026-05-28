const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/announcements/public — anyone can see public announcements
router.get('/public', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM announcements WHERE is_public=true ORDER BY created_at DESC LIMIT 20'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/announcements — logged-in students see all
router.get('/', protect, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/announcements — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  const { title, content, category, is_public } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content required.' });
  try {
    const result = await pool.query(
      `INSERT INTO announcements (title,content,category,is_public,created_by)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [title, content, category || 'General', is_public !== false, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/announcements/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { title, content, category, is_public } = req.body;
  try {
    const result = await pool.query(
      `UPDATE announcements SET title=$1,content=$2,category=$3,is_public=$4,updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [title, content, category, is_public, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/announcements/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM announcements WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
