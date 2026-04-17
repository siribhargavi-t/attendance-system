const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    lowAttendanceThreshold: {
        type: Number,
        default: 75 // 75% default
    },
    institutionName: {
        type: String,
        default: "My College/University"
    },
    academicYear: {
        type: String,
        default: "2023-24"
    },
    currentSemester: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Settings', settingsSchema);
