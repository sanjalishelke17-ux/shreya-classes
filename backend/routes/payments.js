const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
const crypto  = require('crypto');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/payments/create-order — student initiates payment
router.post('/create-order', protect, async (req, res) => {
  const { amount, month, year } = req.body;
  if (!amount) return res.status(400).json({ message: 'Amount required.' });

  // If Razorpay keys not configured, return a mock response for testing
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.json({
      order_id: 'mock_order_' + Date.now(),
      amount: amount * 100,
      currency: 'INR',
      key: 'mock_key',
      mock: true,
    });
  }

  try {
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const order = await razorpay.orders.create({
      amount:   amount * 100,
      currency: 'INR',
      notes:    { student_id: req.user.id, month, year },
    });

    // Save pending payment
    await pool.query(
      `INSERT INTO payments (student_id,amount,month,year,razorpay_order_id,status)
       VALUES ($1,$2,$3,$4,$5,'pending')`,
      [req.user.id, amount, month, year, order.id]
    );

    res.json({ order_id: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Razorpay error:', err);
    res.status(500).json({ message: 'Payment setup failed.' });
  }
});

// POST /api/payments/verify — verify Razorpay signature after payment
router.post('/verify', protect, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  try {
    const body    = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'mock')
      .update(body).digest('hex');

    if (expected !== razorpay_signature && process.env.RAZORPAY_KEY_SECRET) {
      return res.status(400).json({ message: 'Invalid payment signature.' });
    }

    await pool.query(
      `UPDATE payments SET status='paid', razorpay_payment_id=$1 WHERE razorpay_order_id=$2`,
      [razorpay_payment_id, razorpay_order_id]
    );
    res.json({ message: 'Payment verified successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed.' });
  }
});

// GET /api/payments/my — student's own payments
router.get('/my', protect, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM payments WHERE student_id=$1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/payments — admin sees all
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name AS student_name, u.email FROM payments p
       LEFT JOIN users u ON p.student_id=u.id ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
