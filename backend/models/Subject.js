const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a subject name'],
        trim: true,
        unique: true
    },
    code: {
        type: String,
        required: [true, 'Please add a subject code'],
        trim: true,
        unique: true
    },
    department: {
        type: String,
        required: [true, 'Please add a department'],
        trim: true
    },
    semester: {
        type: Number,
        required: [true, 'Please add a semester'],
        min: 1,
        max: 8
    },
    credits: {
        type: Number,
        required: [true, 'Please add credits'],
        default: 3
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Subject', SubjectSchema);
