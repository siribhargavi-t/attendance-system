const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const User = require('../models/User'); // Adjust path if needed

// GET profile (optional)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update profile
router.put('/', authenticateJWT, async (req, res) => {
  try {
    const { name, email, image, banner, ...roleSpecificFields } = req.body;
    
    // Map rollNo to rollNumber for consistency
    const updateData = {
      name,
      email,
      image,
      banner,
      ...roleSpecificFields,
      ...(roleSpecificFields.rollNo ? { rollNumber: roleSpecificFields.rollNo } : {})
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;