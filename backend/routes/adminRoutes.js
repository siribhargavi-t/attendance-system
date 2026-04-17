const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect, admin } = require('../middleware/auth');
const { getDashboardStats, getSubjectAttendanceStats, getStudents } = require('../controllers/adminController'); // <-- Add getSubjectAttendanceStats here

// Fetch real faculty for leave requests
router.get('/faculty', async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' }).select('name email');
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching faculty' });
  }
});

// Fetch all students for attendance marking
router.get('/students', getStudents);

// Dashboard stats route
router.get('/dashboard', getDashboardStats); // <-- Modified line

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email and role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Subject attendance stats route
router.get('/subject-attendance', protect, admin, getSubjectAttendanceStats);

module.exports = router;
