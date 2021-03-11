const Post = require('../models/post');

const User = require('../models/user');

const { validationResult } = require('express-validator/check');

const errorsGenarator = require('../utils/errorGenerator');
const user = require('../models/user');

exports.newPost = (req, res, next) => {
    const errors = validationResult(req);
    errorsGenarator.validationError(errors);

    const content = req.body.content;
    //const image = req.file.image;
    let posts;
    const post = new Post({
        content,
        creator: req.userId
    })
    post.save()
        .then(post => {

            if (!post) {
                errorsGenarator.badRequest();
            }
            return User.findById(req.userId)
                .populate('posts');
            //return post.populate('creator')
        })
        .then(user => {
            //console.log(user);
            if (!user) {
                errorsGenarator.userNotFound();
            }
            posts = [...user.posts, post];
            console.log(posts);
            user.posts.push(post._id);
            return user.save();
        })
        .then(user => {
            //console.log(user);
            //console.log(user.populate('posts'));
            res.json({ message: 'post created', posts: posts, username: user.username })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

};
exports.getUserPosts = (req, res, next) => {
    User.findById(req.userId)
        .populate('posts')
        .then(user => {
            if (!user) {
                errorsGenarator.userNotFound();
            }
            //console.log(user);
            res.json({ message: 'posts got', posts: user.posts, username: user.username });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    console.log(postId);

    Post.findById(postId)
        .then(post => {
            if (req.userId.toString() !== post.creator.toString()) {
                errorsGenarator.forbidden();
            }
            return Post.deleteOne({ _id: postId })

        }).then(result => {
            return User.findById(req.userId)
                .populate('posts')
        })
        .then(user => {
            user.posts.pull(postId);
            return user.save();
        })
        .then(user => {
            res.json({ message: 'Post deleted', posts: user.posts, username: user.username });
        })


}
exports.getEditPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (req.userId.toString() !== post.creator.toString()) {
                errorsGenarator.forbidden();
            }
            if (!post) {
                errorsGenarator.badRequest();
            }
            res.json({ message: 'post fetched succsefully', post: post })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })
}
exports.patchEditPost = (req, res, next) => {
    const errors = validationResult(req);
    errorsGenarator.validationError(errors);
    const content = req.body.content;
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            console.log(post);

            if (req.userId.toString() !== post.creator.toString()) {
                errorsGenarator.forbidden();
            }
            if (!post) {
                errorsGenarator.badRequest();
            }
            post.content = content;
            return post.save();
        })
        .then(post => {
            res.json({ message: "post Updated!!" });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}