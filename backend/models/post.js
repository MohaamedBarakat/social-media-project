const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        message: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);