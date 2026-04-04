const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['present', 'absent'], 
        required: true
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // teacher/admin who marked it
    },
    markedAt: {
        type: Date,
        default: null  // exact timestamp when attendance was marked/last updated
    },
    startTime: {
        type: String, // e.g., "09:00 AM"
        default: null
    },
    endTime: {
        type: String, // e.g., "10:00 AM"
        default: null
    },
    // For student making a request to change absent to present
    changeRequest: {
        type: Boolean,
        default: false
    },
    changeReason: {
        type: String
    },
    documentUrl: { // Letter/doc submitted for evidence
        type: String
    },
    requestStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'none'],
        default: 'none'
    }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);