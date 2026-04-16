const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead } = require("../controllers/notificationController");

// Get notifications for student
router.get("/:email", getNotifications);

// Mark notification as read
router.put("/read/:id", markAsRead);

module.exports = router;