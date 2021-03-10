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
            user.posts.push(post._id);
            return user.save();
        })
        .then(user => {
            console.log(user);
            //console.log(user.populate('posts'));
            res.json({ message: 'post created', })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

};
exports.getUserPosts = async(req, res, next) => {
    User.findById(req.userId)
        .populate('posts')
        .then(user => {
            if (!user) {
                errorsGenarator.userNotFound();
            }
            //console.log(user);
            res.json({ message: 'posts got', posts: user.posts });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}