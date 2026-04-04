const express = require('express');
const router = express.Router();
<<<<<<< HEAD
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
=======

// You will add your controller imports and routes here later
// For example:
// const { loginUser, registerUser } = require('../controllers/authController');
// router.post('/login', loginUser);
// router.post('/register', registerUser);

module.exports = router;
>>>>>>> b2b64c2c5d26d77d57d74e0be84e8a11b0fc16ef
