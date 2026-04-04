const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
require('dotenv').config(); // Make sure to install dotenv: npm install dotenv

const attendanceRoutes = require('./routes/attendanceRoutes'); 
const authRoutes = require('./routes/authRoutes'); // Assuming you have this

const app = express();
<<<<<<< HEAD
const PORT = 5001; // changed to 5001 to bypass macOS AirPlay control receiver
=======
>>>>>>> b2b64c2c5d26d77d57d74e0be84e8a11b0fc16ef

// Middleware
app.use(cors());
app.use(express.json());
app.use(body_parser.json());

<<<<<<< HEAD
// routes
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes"); 
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use('/api/admin', adminRoutes);

const User = require('./models/User');
const bcrypt = require('bcryptjs');

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("Connected to MongoDB");
    try {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            const defaultAdmin = new User({
                username: 'admin',
                email: 'admin@system.com',
                password: hashedPassword,
                role: 'admin',
                isSuperAdmin: true
            });
            await defaultAdmin.save();
            console.log("Default admin account created: [admin / password123]");
        }
    } catch (err) {
        console.error("Error seeding default admin:", err);
    }
})
.catch(err => console.log(err));
=======
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
>>>>>>> b2b64c2c5d26d77d57d74e0be84e8a11b0fc16ef

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});