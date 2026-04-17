const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead, deleteNotification, clearAllNotifications } = require("../controllers/notificationController");

// Get notifications for student
router.get("/:email", getNotifications);

// Mark notification as read
router.put("/read/:id", markAsRead);

// Delete single notification
router.delete("/:id", deleteNotification);

// Clear all notifications for user
router.delete("/clear/:email", clearAllNotifications);

module.exports = router;