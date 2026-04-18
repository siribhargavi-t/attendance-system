const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    reason: {
        type: String,
        enum: ['hackathon', 'nptel-exam', 'internship', 'medical', 'family-emergency', 'sports-event', 'other'],
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    documentUrl: {
        type: String,
        default: ''
    },
    documentVerified: {
        type: Boolean,
        default: null   // null = not reviewed, true = verified, false = rejected
    },
    documentVerifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    documentVerifiedAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminComment: {
        type: String,
        default: ''
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
