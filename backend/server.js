const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
require('dotenv').config(); // Make sure to install dotenv: npm install dotenv

const attendanceRoutes = require('./routes/attendanceRoutes'); 
const authRoutes = require('./routes/authRoutes'); // Assuming you have this

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(body_parser.json());

// --- FIX: REMOVE DEPRECATED MONGOOSE OPTIONS ---
const connectDB = async () => {
  try {
    // Remove the options object { useNewUrlParser: true, useUnifiedTopology: true }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Call the function to connect to the database
connectDB();

// API Routes
app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes); // Assuming you have this

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});