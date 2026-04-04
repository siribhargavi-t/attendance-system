const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// --- LOGIN ROUTE (Already Correct) ---
// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 1. Validate that input was received
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please enter all fields' });
  }

  try {
    // 2. Find the user in the database by their username
    const user = await User.findOne({ username });
    if (!user) {
      // Use a generic error message for security (don't reveal if username exists)
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Compare the submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Use the same generic error message
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // 4. If credentials are correct, create the JWT payload
    const payload = {
      id: user.id,
      role: user.role,
      username: user.username,
      isSuperAdmin: user.isSuperAdmin,
    };

    // 5. Sign the token with the secret key and send it back to the client
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          role: user.role,
          username: user.username,
          isSuperAdmin: user.isSuperAdmin,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- REGISTER ROUTE (NEW) ---
// @route   POST api/auth/register
// @desc    Register a new user (admin or student)
// @access  Private (should only be accessible by an admin)
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  // Basic validation
  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: 'Please provide username, password, and role' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create a new user instance
    // We DO NOT hash the password here. The pre-save hook in User.js will do it.
    user = new User({
      username,
      password,
      role,
      // isSuperAdmin can be set based on logic if needed
    });

    // Save the user to the database. This triggers the hashing.
    await user.save();

    // Respond without sending the password
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;