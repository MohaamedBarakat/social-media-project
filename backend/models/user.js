const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    friends: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        chatId: {
            type: Schema.Types.ObjectId,
            ref: 'Chat'
        }
    }],
    requests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    stars: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);