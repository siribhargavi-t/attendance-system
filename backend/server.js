const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const attendanceRoutes = require('./routes/attendance');
const authRoutes = require('./routes/auth'); 
const adminRoutes = require('./routes/adminRoutes');
const attendance = require("./routes/attendance");
// FIX: Remove the path to let dotenv find the .env file automatically
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// FIX: Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes); 
app.use('/api/attendance', attendance);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));