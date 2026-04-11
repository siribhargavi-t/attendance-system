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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Subject', SubjectSchema);
