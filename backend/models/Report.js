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
    reportType: {
        type: String,
        enum: ['Monthly', 'Weekly', 'Subject-wise', 'Overall'],
        default: 'Monthly'
    },
    parameters: {
        type: mongoose.Schema.Types.Mixed, // Stores filters like startDate, endDate, subjectId
        default: {}
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
