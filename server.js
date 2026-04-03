<<<<<<< HEAD
require('dotenv').config();
=======
require("dotenv").config();
>>>>>>> e6b0874d42ba57d0ee79310642bc0ad2025bae5a
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000; // use 5000 to avoid conflict with frontend

// middleware
app.use(cors());
app.use(express.json());

// routes
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes"); // Import attendance routes
const adminRoutes = require('./routes/adminRoutes');
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes); // Use attendance routes with a base path
app.use('/api/admin', adminRoutes);

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB Error:", err.message));

// server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
