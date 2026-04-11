const express = require("express");
const router = express.Router();
// FIX: Import addStudent from the controller
const { getDashboardStats, getStudents, addStudent } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes in this file are prefixed with /api/admin
router.get('/dashboard-stats', protect, authorize('admin'), getDashboardStats);

// FIX: Chain the GET and POST routes for the same endpoint
router.route('/students')
    .get(protect, authorize('admin'), getStudents)
    .post(protect, authorize('admin'), addStudent);

module.exports = router;