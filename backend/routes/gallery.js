const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { protect, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/gallery');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `gallery_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
  },
});

// GET /api/gallery — public
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM gallery WHERE is_active=true ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/gallery — admin uploads image
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
  const { title, description, category } = req.body;
  const imageUrl = `/uploads/gallery/${req.file.filename}`;
  try {
    const result = await pool.query(
      `INSERT INTO gallery (title,description,image_url,category)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [title, description, imageUrl, category || 'General']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/gallery/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await pool.query('SELECT * FROM gallery WHERE id=$1', [req.params.id]);
    if (item.rows.length) {
      const filePath = path.join(__dirname, '..', item.rows[0].image_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await pool.query('DELETE FROM gallery WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
