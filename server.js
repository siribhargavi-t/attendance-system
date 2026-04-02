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
app.use("/api/students", studentRoutes);

// MongoDB Atlas connection
mongoose.connect("mongodb+srv://test:test123@cluster0.ajuicv3.mongodb.net/attendance-system")
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

// server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});