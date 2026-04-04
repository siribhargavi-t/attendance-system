const express = require('express');
const router = express.Router();
const { login, registerAdmin, forgotPassword, resetPassword } = require('../controllers/authController');

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

module.exports = router;
