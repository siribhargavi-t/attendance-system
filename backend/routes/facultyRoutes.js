const express = require("express");
const router = express.Router();
const { sendStudentEmail } = require("../controllers/facultyController");
const { protect } = require("../middleware/auth"); // Using the middleware I verified earlier

router.post("/send-email", protect, sendStudentEmail);

module.exports = router;
