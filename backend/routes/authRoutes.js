const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function genToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { fullName, mobile, email, password } = req.body;

    if (!fullName || !mobile || !email || !password)
      return res.status(400).json({ message: 'Please fill all fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already used' });

    const user = await User.create({ fullName, mobile, email, password });

    res.status(201).json({
      token: genToken(user._id),
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // login with email or mobile
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { mobile: emailOrUsername }],
    });

    if (!user || !(await user.matchPassword(password)))
      return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      token: genToken(user._id),
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
