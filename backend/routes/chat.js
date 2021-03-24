const express = require('express');

const chatControllers = require('../controlles/chat');

const isAuth = require('../middleware/is-auth');

const { body } = require('express-validator/check');

const router = express.Router();

router.get('/chat/users', isAuth, chatControllers.userFriendsChat);

router.get('/chat/:chatId', isAuth, chatControllers.chat);

router.put('/chat/:chatId', [
    body('message', 'invalid Message')
    .trim()
    .isLength({ min: 1 })
], isAuth, chatControllers.putMessage);

module.exports = router;