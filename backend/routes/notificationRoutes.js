const express = require("express");
const router = express.Router();
const { getNotifications } = require("../controllers/notificationController");

// Get notifications for student
router.get("/:email", getNotifications);

module.exports = router;