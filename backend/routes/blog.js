const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/blog — public published posts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT bp.*, u.name AS author_name FROM blog_posts bp
       LEFT JOIN users u ON bp.author_id=u.id
       WHERE bp.is_published=true ORDER BY bp.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/blog/all — admin sees all drafts too
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT bp.*, u.name AS author_name FROM blog_posts bp
       LEFT JOIN users u ON bp.author_id=u.id ORDER BY bp.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/blog/:slug — single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT bp.*, u.name AS author_name FROM blog_posts bp
       LEFT JOIN users u ON bp.author_id=u.id
       WHERE bp.slug=$1 AND bp.is_published=true`,
      [req.params.slug]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/blog — admin creates post
router.post('/', protect, adminOnly, async (req, res) => {
  const { title, content, excerpt, image_url, category, is_published } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content required.' });
  const slug = slugify(title) + '-' + Date.now();
  try {
    const result = await pool.query(
      `INSERT INTO blog_posts (title,slug,content,excerpt,image_url,category,is_published,author_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [title, slug, content, excerpt, image_url, category || 'General', is_published || false, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/blog/:id — admin edits post
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { title, content, excerpt, image_url, category, is_published } = req.body;
  try {
    const result = await pool.query(
      `UPDATE blog_posts SET title=$1,content=$2,excerpt=$3,image_url=$4,
       category=$5,is_published=$6,updated_at=NOW() WHERE id=$7 RETURNING *`,
      [title, content, excerpt, image_url, category, is_published, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/blog/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM blog_posts WHERE id=$1', [req.params.id]);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
