const express = require("express");
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
const { getDashboardStats, getMyAttendance, submitAttendanceRequest } = require("../controllers/studentController");
const { sendEmail } = require("../utils/emailService");

router.get("/dashboard", getDashboardStats);
router.get("/attendance", getMyAttendance);
router.post("/request", submitAttendanceRequest);

// POST /api/send-warning
router.post("/send-warning", async (req, res) => {
  try {
    const { studentName, studentEmail, reason, document } = req.body;
    // Principal's email (replace with actual)
    const principalEmail = "principal@example.com";
    let message = `Warning Request from ${studentName} (${studentEmail}):\nReason: ${reason}`;
    if (document) {
      message += `\nDocument attached (base64): ${document.substring(0, 30)}...`;
    }
    await sendEmail(
      principalEmail,
      "Student Warning Request",
      message
    );
    res.json({ message: "Warning email sent to principal." });
  } catch (err) {
    res.status(500).json({ message: "Failed to send warning email." });
  }
});

module.exports = router;