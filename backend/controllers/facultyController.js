const { sendEmail } = require("../utils/emailService");

// @desc    Send custom email to a student
// @route   POST /api/faculty/send-email
// @access  Private (Faculty/Admin)
exports.sendStudentEmail = async (req, res) => {
  try {
    const { studentEmail, subject, message } = req.body;

    // 1. Validation
    if (!studentEmail || !subject || !message) {
      return res.status(400).json({ message: "Please provide student email, subject, and message." });
    }

    // 2. Permission check (assuming protect middleware already attached user)
    if (req.user.role !== "faculty" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only faculty or admins can send emails to students." });
    }

    // 3. Send the email
    // We can prepend the faculty name to the message for clarity
    const emailBody = `Message from Faculty (${req.user.name}):\n\n${message}`;

    await sendEmail(studentEmail, subject, emailBody);

    res.status(200).json({ message: "Email sent successfully to student." });

  } catch (err) {
    console.error("❌ SEND EMAIL ERROR:", err);
    res.status(500).json({ message: "Failed to send email. Check SMTP settings." });
  }
};
