const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// DO NOT CALL login(), just pass login
router.post('/login', login);

module.exports = router;
