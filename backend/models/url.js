const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true 
    },
    shortId: { 
        type: String,
        required: true, 
        unique: true },
    createdAt: { 
        type: Date, 
        default: Date.now
    },
    expiry: {
        type: Date,
        default: null
    },
    clicks: {
        type: Number,
        default: 0
    },
    sources: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Url', urlSchema);


