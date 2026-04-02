const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

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
app.listen(3000, () => {
  console.log("Server running on port 3000");
});