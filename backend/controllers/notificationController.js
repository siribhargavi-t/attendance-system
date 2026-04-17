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

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

exports.clearAllNotifications = async (req, res) => {
  try {
    const { email } = req.params;
    await Notification.deleteMany({ studentEmail: email });
    res.json({ message: "All notifications cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear notifications" });
  }
};