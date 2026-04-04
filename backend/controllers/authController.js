const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '10h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    token,
                    role: user.role,
                    username: user.username,
                    isSuperAdmin: user.isSuperAdmin
                });
            }
        );
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const { sendEmail } = require('../utils/emailService');
const crypto = require('crypto');

const registerAdmin = async (req, res) => {
    try {
        const { username, email, password, assignedBranches, assignedSubjects } = req.body;

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // If no subjects/branches are assigned, they are a superadmin
        const isSuperAdmin = (!assignedBranches || assignedBranches.length === 0) && (!assignedSubjects || assignedSubjects.length === 0);

        user = new User({
            username,
            email,
            password: hashedPassword,
            role: 'admin',
            isSuperAdmin,
            assignedBranches: assignedBranches || [],
            assignedSubjects: assignedSubjects || []
        });

        await user.save();
        res.status(201).json({ success: true, message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found with this email' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const message = `You requested a password reset. Please go to this link to reset your password: \n\n${resetUrl}`;

        await sendEmail(user.email, 'Password Reset Token', message);

        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: 'Password changed successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = { login, registerAdmin, forgotPassword, resetPassword, changePassword };