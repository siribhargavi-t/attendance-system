const User = require('../models/User'); // Assuming you have a User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 3. Generate JWT Token
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign the token. Use an environment variable for your secret in production.
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your_jwt_secret', // It's recommended to use an environment variable
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                // 4. Return token in response
                res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    token
                });
            }
        );

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Make sure to export your login function
module.exports = { login };