const express = require('express');

const { body } = require('express-validator/check');

const postController = require('../controlles/post');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.put('/new-post', isAuth, [
    body('content', 'Invalid post content')
    .trim()
    .isLength({ min: 1 })
], postController.newPost);

router.get('/posts', isAuth, postController.getUserPosts);

module.exports = router;