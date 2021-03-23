const express = require('express');

const { body } = require('express-validator/check');

const postController = require('../controlles/post');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.put('/new-post/user/:userId', isAuth, [
    body('content', 'Invalid post content')
    .trim()
    .isLength({ min: 1 })
], postController.newPost);

router.get('/posts/:userId', isAuth, postController.getUserPosts);

router.delete('/post/:postId/user/:userId', isAuth, postController.deletePost);

router.get('/post/:postId', isAuth, postController.singlePost);

router.patch('/post/:postId', isAuth, [
    body('content', 'Invalid post content')
    .trim()
    .isLength({ min: 1 })
], postController.patchEditPost);

router.post('/post/:postId/like', isAuth, postController.likePost);

router.put('/post/:postId/comment', isAuth, [
    body('commentMessage', 'Invalid post content')
    .trim()
    .isLength({ min: 1 })
], postController.putComment);

router.get('/post/:postId/comment', isAuth, postController.getPostComments);

router.delete('/post/:postId/comment/:commentId', isAuth, postController.deleteComment);

router.patch('/edit-comment/post/:postId/comment/:commentId', isAuth, [
    body('commentMessage', 'invalid edit comment')
    .trim()
    .isLength({ min: 1 })
], postController.editComment);

router.get('/users-likes/post/:postId', isAuth, postController.usersLikes);

module.exports = router;