// backend/controllers/notificationController.js
const Notification = require("../models/Notification");
exports.getNotifications = async (req, res) => {
  try {
    const { email } = req.params;
    const notifs = await Notification.find({ studentEmail: email });
    res.json(notifs);
  } catch {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};