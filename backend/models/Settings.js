const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    lowAttendanceThreshold: {
        type: Number,
        default: 75 // 75% default
    }
});

module.exports = mongoose.model('Settings', settingsSchema);
