const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        },
        username: String
    },
    text: String

});
module.exports = mongoose.model('Comment',commentSchema);