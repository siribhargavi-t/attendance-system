// backend/controllers/notificationController.js
const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const { email } = req.params;
    const notifications = await Notification.find({ studentEmail: email }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};