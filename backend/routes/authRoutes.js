const express = require('express');
const router = express.Router();
const { login, registerAdmin, forgotPassword, resetPassword, changePassword } = require('../controllers/authController');

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', login);

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// @route   POST /api/auth/register-admin
// @desc    Register an admin (restricted to existing admins)
router.post('/register-admin', [authMiddleware, adminMiddleware], registerAdmin);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// @route   POST /api/auth/change-password
// @desc    Change password for any authenticated user (student or admin)
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
