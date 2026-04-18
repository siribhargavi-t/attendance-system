const express = require('express');
const router = express.Router();

const { register, login, updatePassword } = require("../controllers/authController");
const authenticateJWT = require("../middleware/authenticateJWT");

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.put("/update-password", authenticateJWT, updatePassword);

module.exports = router;