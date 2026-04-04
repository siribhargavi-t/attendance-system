const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'student'
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    assignedSubjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    assignedBranches: [{
        type: String
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
