// backend/models/Notification.js
const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model("Notification", NotificationSchema);