const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    format: {
        type: String,
        enum: ['csv', 'pdf'],
        default: 'csv'
    },
    fileUrl: String,
    dateGenerated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);
