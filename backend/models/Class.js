const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Add other fields as needed
});

module.exports = mongoose.model("Class", ClassSchema);