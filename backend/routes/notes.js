const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { protect, adminOnly } = require('../middleware/auth');

// 🔥 Firebase Admin
const admin = require('firebase-admin');

// ─────────────────────────────────────────────────────────────
// MULTER STORAGE SETUP
// ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    const dir = path.join(__dirname, '../uploads/notes');

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename: (req, file, cb) => {

    const safeName =
      file.originalname.replace(/\s+/g, '_');

    cb(null, `${Date.now()}_${safeName}`);
  },
});

// ─────────────────────────────────────────────────────────────
// FILE FILTER
// ─────────────────────────────────────────────────────────────
const upload = multer({

  storage,

  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },

  fileFilter: (req, file, cb) => {

    const allowed = [
      '.pdf',
      '.doc',
      '.docx',
      '.ppt',
      '.pptx',
      '.txt',
      '.jpg',
      '.jpeg',
      '.png',
    ];

    const ext =
      path.extname(file.originalname).toLowerCase();

    if (allowed.includes(ext)) {

      cb(null, true);

    } else {

      cb(new Error('File type not allowed'));
    }
  },
});

// ─────────────────────────────────────────────────────────────
// TEMP TOKENS STORAGE
// ─────────────────────────────────────────────────────────────
let savedTokens = [];

// ─────────────────────────────────────────────────────────────
// SAVE FCM TOKEN
// ─────────────────────────────────────────────────────────────
router.post('/save-token', async (req, res) => {

  try {

    const { token } = req.body;

    if (!token) {

      return res.status(400).json({
        success: false,
        message: 'Token required',
      });
    }

    // Avoid duplicates
    if (!savedTokens.includes(token)) {

      savedTokens.push(token);
    }

    console.log('\n✅ TOKEN SAVED');
    console.log(savedTokens);

    res.json({
      success: true,
      message: 'Token saved successfully',
    });

  } catch (error) {

    console.log('\n❌ TOKEN SAVE ERROR');
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ─────────────────────────────────────────────────────────────
// GET NOTES
// ─────────────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {

  try {

    const { class: cls, subject } = req.query;

    let query =
      'SELECT * FROM notes WHERE is_active=true';

    const params = [];

    if (cls) {

      params.push(cls);

      query += ` AND class=$${params.length}`;
    }

    if (subject) {

      params.push(subject);

      query += ` AND subject=$${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const result =
      await pool.query(query, params);

    res.json(result.rows);

  } catch (error) {

    console.log('\n❌ GET NOTES ERROR');
    console.log(error);

    res.status(500).json({
      message: 'Server error',
    });
  }
});

// ─────────────────────────────────────────────────────────────
// DOWNLOAD NOTE
// ─────────────────────────────────────────────────────────────
router.get('/:id/download', protect, async (req, res) => {

  try {

    const result = await pool.query(
      'SELECT * FROM notes WHERE id=$1 AND is_active=true',
      [req.params.id]
    );

    if (!result.rows.length) {

      return res.status(404).json({
        message: 'File not found',
      });
    }

    const note = result.rows[0];

    // Increment downloads
    await pool.query(
      'UPDATE notes SET downloads=downloads+1 WHERE id=$1',
      [note.id]
    );

    const filePath = path.join(
      __dirname,
      '../uploads/notes',
      path.basename(note.file_url)
    );

    res.download(
      filePath,
      note.file_name ||
      path.basename(note.file_url)
    );

  } catch (error) {

    console.log('\n❌ DOWNLOAD ERROR');
    console.log(error);

    res.status(500).json({
      message: 'Server error',
    });
  }
});

// ─────────────────────────────────────────────────────────────
// UPLOAD NOTE + SEND NOTIFICATION
// ─────────────────────────────────────────────────────────────
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('file'),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message: 'No file uploaded',
        });
      }

      const {
        title,
        description,
        subject,
        class: cls,
      } = req.body;

      const result = await pool.query(

        `INSERT INTO notes
        (
          title,
          description,
          subject,
          class,
          file_url,
          file_name,
          file_size,
          created_by
        )

        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7,$8
        )

        RETURNING *`,

        [
          title,
          description,
          subject,
          cls,
          req.file.filename,
          req.file.originalname,
          req.file.size,
          req.user.id,
        ]
      );

      const newNote = result.rows[0];

      console.log('\n✅ NOTE UPLOADED');

      // 🔥 SEND PUSH NOTIFICATION
      if (savedTokens.length > 0) {

        try {

          const message = {

            notification: {
              title: '📚 New Notes Uploaded',
              body: `${title} notes are now available`,
            },

            tokens: savedTokens,
          };

          console.log('\n📤 SENDING NOTIFICATION...');
          console.log(message);

          const response =
            await admin
              .messaging()
              .sendEachForMulticast(message);

          console.log(
            '\n🔥 FIREBASE RESPONSE:\n',
            JSON.stringify(response, null, 2)
          );

          // Remove invalid tokens
          response.responses.forEach((resp, idx) => {

            if (resp.success) {

              console.log(
                `✅ SUCCESS FOR TOKEN ${idx + 1}`
              );

            } else {

              console.log(
                `❌ REMOVING INVALID TOKEN ${idx + 1}`
              );

              console.log(resp.error);

              savedTokens = savedTokens.filter(
                token => token !== message.tokens[idx]
              );
            }
          });

          console.log('\n🧹 ACTIVE TOKENS:');
          console.log(savedTokens);

        } catch (notificationError) {

          console.log(
            '\n❌ NOTIFICATION ERROR'
          );

          console.log(notificationError);
        }
      }

      res.status(201).json(newNote);

    } catch (error) {

      console.log('\n❌ UPLOAD ERROR');
      console.log(error);

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);

// ─────────────────────────────────────────────────────────────
// DELETE NOTE
// ─────────────────────────────────────────────────────────────
router.delete(
  '/:id',
  protect,
  adminOnly,

  async (req, res) => {

    try {

      await pool.query(
        'UPDATE notes SET is_active=false WHERE id=$1',
        [req.params.id]
      );

      res.json({
        message: 'Note removed',
      });

    } catch (error) {

      console.log('\n❌ DELETE ERROR');
      console.log(error);

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);

module.exports = router;