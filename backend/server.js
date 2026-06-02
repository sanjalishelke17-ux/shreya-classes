const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 🔥 Firebase temporarily disabled for deployment

const app = express();

// ─────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://shreyaclasses.com',
      'https://shreya-classes-tution.onrender.com'
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─────────────────────────────────────────────────────────────
// TEMP TOKEN STORAGE
// ─────────────────────────────────────────────────────────────
let savedTokens = [];

// ─────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/students', require('./routes/students'));
app.use('/api/admissions', require('./routes/admissions'));
app.use('/api/payments', require('./routes/payments'));

// ─────────────────────────────────────────────────────────────
// Health Route
// ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {

  res.json({
    status: 'ok',
    message: 'Shreya Commerce Classes API is running.',
  });

});

// ─────────────────────────────────────────────────────────────
// SAVE FCM TOKEN
// ─────────────────────────────────────────────────────────────
app.post('/api/notifications/save-token', async (req, res) => {

  try {

    const { token } = req.body;

    if (!token) {

      return res.status(400).json({
        success: false,
        message: 'Token required',
      });
    }

    // Avoid duplicate tokens
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

    console.error('\n❌ SAVE TOKEN ERROR:\n', error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ─────────────────────────────────────────────────────────────
// SEND NOTIFICATION FUNCTION
// ─────────────────────────────────────────────────────────────
const sendPushNotification = async (title, body) => {

  console.log('\n🔕 FIREBASE DISABLED');
  console.log('Title:', title);
  console.log('Body:', body);
  console.log('Active Tokens:', savedTokens.length);

  return true;
};
// ─────────────────────────────────────────────────────────────
// SEND TEST NOTIFICATION
// ─────────────────────────────────────────────────────────────
app.post('/api/send-notification', async (req, res) => {

  try {

    const title =
      req.body.title || 'Shreya Classes 🚀';

    const body =
      req.body.body || 'New update available 🚀';

    await sendPushNotification(title, body);

    res.json({
      success: true,
      message: 'Notification process completed',
      activeTokens: savedTokens.length,
    });

  } catch (error) {

    console.error('\n❌ NOTIFICATION ERROR:\n', error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ─────────────────────────────────────────────────────────────
// NOTES NOTIFICATION ROUTE
// ─────────────────────────────────────────────────────────────
app.post('/api/send-note-notification', async (req, res) => {

  try {

    const { title, subject } = req.body;

    await sendPushNotification(
      '📚 New Notes Uploaded',
      `${title} notes uploaded for ${subject}`
    );

    res.json({
      success: true,
      message: 'Notes notification sent',
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ─────────────────────────────────────────────────────────────
// Production Build
// ─────────────────────────────────────────────────────────────
/*
if (process.env.NODE_ENV === 'production') {

  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {

    res.sendFile(
      path.join(__dirname, '../frontend/build', 'index.html')
    );
  });
}
    */

// ─────────────────────────────────────────────────────────────
// 404 Route
// ─────────────────────────────────────────────────────────────
app.use((req, res) => {

  res.status(404).json({
    message: 'Route not found',
  });
});

// ─────────────────────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {

  console.error('\n❌ SERVER ERROR:\n', err);

  res.status(500).json({
    message: 'Internal server error',
  });
});

// ─────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {

  console.log(`\n🚀 Shreya Commerce Classes API`);
  console.log(`   Running at: http://localhost:${PORT}`);
  console.log(`   Health:     http://localhost:${PORT}/api/health\n`);

});