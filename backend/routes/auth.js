const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure this path is correct

const router = express.Router();

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please enter all fields' });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create JWT Payload
    const payload = {
      id: user.id,
      role: user.role,
      username: user.username,
      isSuperAdmin: user.isSuperAdmin,
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Make sure you have a JWT_SECRET in your .env file
      { expiresIn: '1h' }, // Token expires in 1 hour
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

// You can add register, forgot-password, etc. routes here as well

module.exports = router;