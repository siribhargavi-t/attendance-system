const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    branch: {
        type: String,
        required: true,
        default: 'General'
    },
    parentEmail: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);