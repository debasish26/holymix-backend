const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path to your User model
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret_here'; // Replace with your JWT secret

// Login route
router.post('/login', async (req, res) => {
  console.log('Login route hit');
  const { email, password } = req.body;
  console.log(`Login attempt for email: ${email}`);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`User found: ${email}`);
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      console.log(`Invalid password for user: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`Password valid for user: ${email}`);
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log(`User already exists: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered', token });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
