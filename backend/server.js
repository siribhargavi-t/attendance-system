const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON bodies

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.error('MongoDB Connection Error:', err));

// --- API Routes ---
// Import your route files
const authRoutes = require('./routes/auth');

// Use the routes with a base path
app.use('/api/auth', authRoutes);
// You will add other routes here later, e.g., app.use('/api/students', studentRoutes);


// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});