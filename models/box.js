const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
    name: String,
    url: String,
    description: String,
    video: String,
    date: String,
    timeonair: Date,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]

});

module.exports = mongoose.model('Box',boxSchema);