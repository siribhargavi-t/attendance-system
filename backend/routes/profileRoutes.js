const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const User = require('../models/User'); // Adjust path if needed

// GET profile (optional, keep if you still need to fetch profile from backend)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;