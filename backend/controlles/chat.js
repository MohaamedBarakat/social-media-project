const Chat = require('../models/chat');

const User = require('../models/user');

const socketIO = require('../socket');

exports.userFriendsChat = async(req, res, next) => {
    try {
        const user = await User
            .findById(req.userId, '_id friends')
            .populate({
                path: 'friends',
                populate: {
                    path: 'userId',
                    select: '_id firstname lastname image'
                }
            })
            .populate({
                path: 'friends',
                populate: {
                    path: 'chatId'
                }
            });

        res.status(200).json({
            userFriends: user.friends
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    }
};
exports.chat = async(req, res, next) => {
    try {
        const chatId = req.params.chatId;
        const chat = await Chat
            .findById(chatId, '_id messages')
            .populate({
                path: 'messages',
                populate: {
                    path: 'userId',
                    select: '_id username image'
                }
            })
        res.status(200).json({
            chat: chat
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    }
};

exports.putMessage = async(req, res, next) => {
    try {
        const message = req.body.message;
        const chatId = req.params.chatId;
        let chat = await Chat.findById(chatId);
        await chat.messages.push({
            userId: req.userId,
            message: message,
            date: Date.now()
        })
        chat = await (await chat.save())
            .populate({ path: 'messages', populate: { path: 'userId', select: '_id username image' } })
            .execPopulate();
        socketIO.getIo().emit(chatId.toString(), { chat: chat });
        res.status(200)
            .json({
                chat: chat
            })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    }
}