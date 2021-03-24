const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    messages: [{
        message: {
            type: String,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date
        }
    }]
}, { timestamps: true });
module.exports = mongoose.model('Chat', chatSchema);