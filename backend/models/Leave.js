const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    facultyName: { type: String, required: true }, // <-- must be present!
    facultyEmail: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
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