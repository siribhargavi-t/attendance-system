// create mongoose schema for attendance with studentId, date, status
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const attendanceSchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['present', 'absent'], // As per your request for 'present' or 'absent'
        required: true
    }
});
module.exports = mongoose.model('Attendance', attendanceSchema);