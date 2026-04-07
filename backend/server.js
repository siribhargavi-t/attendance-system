const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// FIX: Remove the path to let dotenv find the .env file automatically
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const attendance = require('./routes/attendance'); // Assuming you have this

const app = express();

// Body parser
app.use(express.json());

// FIX: Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/attendance', attendance); // Example for attendance routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));