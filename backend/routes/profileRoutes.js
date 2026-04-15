const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const User = require('../models/User'); // Adjust path if needed

// GET profile
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE profile
router.put('/', authenticateJWT, async (req, res) => {
  try {
    const { name, email, image, class: studentClass, rollNo, department, adminRole } = req.body;
    const updateFields = { name, email, image };
    if (req.user.role === "student") {
      updateFields.class = studentClass;
      updateFields.rollNo = rollNo;
    }
    if (req.user.role === "faculty") {
      updateFields.department = department;
    }
    if (req.user.role === "admin") {
      updateFields.adminRole = adminRole;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;