const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    // FIX: Change the field name from 'student' to 'studentId'
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This should reference your User model
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject', // This should reference your Subject model
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the admin/faculty who marked it
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Attendance', AttendanceSchema);