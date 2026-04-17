const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true, lowercase: true, trim: true },
    facultyName: { type: String, required: true }, // <-- must be present!
    facultyEmail: { type: String, required: true, lowercase: true, trim: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    leaveType: {
      type: String,
      enum: ["Medical", "Duty", "Personal", "Other"],
      default: "Personal",
    },
    appliedDate: { type: Date, default: Date.now },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    document: { type: String }, // base64, optional
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", LeaveSchema);