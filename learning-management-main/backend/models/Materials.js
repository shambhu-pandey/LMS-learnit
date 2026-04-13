const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Material title is required'],
        trim: true
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required']
    },
    fileName: {
        type: String,
        required: [true, 'File name is required']
    },
    fileType: {
        type: String,
        default: 'pdf'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = materialSchema;