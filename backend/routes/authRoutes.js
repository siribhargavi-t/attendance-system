const express = require('express');
const router = express.Router();

const { login } = require("../controllers/authController");

// Only define the login route
router.post("/login", login);

module.exports = router;