const Post = require('../models/post');

const User = require('../models/user');

const { validationResult } = require('express-validator/check');

const errorsGenarator = require('../utils/errorGenerator');

const user = require('../models/user');

const { clearImage } = require('../utils/main');

exports.newPost = (req, res, next) => {
    const errors = validationResult(req);
    errorsGenarator.validationError(errors);
    const userId = req.params.userId;
    const content = req.body.content;
    //console.log(userId);
    let image;
    if (req.file) {
        image = req.file.path;
    }
    let posts;
    //console.log(image);
    const post = new Post({
        content,
        creator: req.userId,
        image: image,
        like: []
    })
    post.save()
        .then(post => {
            if (!post) {
                errorsGenarator.badRequest();
            }
            return User.findById(userId)
                //return post.populate('creator')
        })
        .then(user => {
            //console.log(user);
            if (!user) {
                errorsGenarator.userNotFound();
            }
            posts = [...user.posts, post._id];
            //console.log(posts);
            user.posts = posts;
            console.log(user.posts);
            return user.save();
        })
        .then(user => {
            //console.log(user);
            //console.log(user.populate('posts'));
            res.json({ message: 'post created', posts: posts, username: user.username });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
exports.getUserPosts = async(req, res, next) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            errorsGenarator.badRequest();
        }
        const posts = await User.findById(userId, 'posts')
            .populate({ path: 'posts', options: { sort: { updatedAt: -1 } }, populate: { path: 'creator', select: '_id username image' } });
        //console.log(posts);
        res.status(200).json({
            posts: posts.posts
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.deletePost = async(req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.params.userId;
        const post = await Post.findById(postId).populate('creator', '_id');
        const user = await User.findById(userId).populate({ path: 'posts', options: { sort: { updatedAt: -1 } }, populate: { path: 'creator', select: '_id username image' } });
        if (post.creator._id.toString() !== req.userId.toString() && post.creator._id.toString() !== userId.toString()) {
            errorsGenarator.forbidden();
        }
        await Post.deleteOne({ _id: postId });
        user.posts.pull(post._id);
        user.save();
        res.status(200).json({
            message: 'post deleted',
            posts: user.posts
        })


    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

    //console.log(postId);
    /*Post.findById(postId)
        .then(post => {
            if (!post) {
                errorsGenarator.badRequest();
            }
            if (req.userId.toString() !== post.creator.toString()) {
                errorsGenarator.forbidden();
            }
            if (post.image) {
                clearImage(post.image);
            }
            return Post.deleteOne({ _id: postId });
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
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })*/
}
exports.singlePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .populate('creator')
        .then(post => {
            if (!post) {
                errorsGenarator.badRequest();
            }
            //console.log(post);
            res.json({ message: 'post fetched succsefully', post: post, user: { username: post.creator.username, } })
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
};
exports.likePost = (req, res, next) => {
    const postId = req.params.postId;
    let like = false;
    //console.log(postId);
    Post.findById(postId)
        .then(post => {
            if (!post) {
                errorsGenarator.badRequest();
            }
            post.likes.map(id => {
                    if (id.toString() === req.userId.toString()) {
                        like = true;
                    }
                })
                //console.log(like);
            if (!like) {
                post.likes.push(req.userId);
                //console.log('like');
            } else {
                post.likes.pull(req.userId);
                //console.log('unlike');
            }
            return post.save();

        })
        .then(post => {
            //console.log(post);
            res.status(201).json({ message: 'post liked', post: post });

        })
}
exports.putComment = (req, res, next) => {
    const errors = validationResult(req);
    errorsGenarator.validationError(errors);
    const postId = req.params.postId;
    const commentMessage = req.body.commentMessage;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                errorsGenarator.badRequest();
            }
            post.comments.push({ creator: req.userId, message: commentMessage })
            return post.save();
        })
        .then(post => {
            return post.populate({
                path: 'comments',
                populate: { path: 'creator', select: 'username image' }
            }).execPopulate()

        })
        .then(post => {
            //console.log(post.comments);
            res.status(201).json({ message: 'Comment accepted', comments: post.comments });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}
exports.getPostComments = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                errorsGenarator.badRequest();
            }
            return post.populate({
                path: 'comments',
                populate: { path: 'creator', select: 'username image' }
            }).execPopulate()

        })
        .then(post => {
            //console.log(post.comments);
            res.status(201).json({ message: 'Comment accepted', comments: post.comments });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};
exports.deleteComment = (req, res, next) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                errorsGenarator.badRequest();
            }
            post.comments.pull(commentId);
            return post.save();
        })
        .then(post => {
            return post.populate({
                path: 'comments',
                populate: { path: 'creator', select: 'username image' }
            }).execPopulate()

        })
        .then(result => {
            res.status(200).json({
                message: 'Comment Deleted',
                comments: result.comments
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
exports.editComment = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        errorsGenarator.validationError(errors)
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const commentMessage = req.body.commentMessage;
        if (!postId || !commentId) {
            errorsGenarator.badRequest();
        }
        let postComments = await Post.findById(postId, 'comments').populate({ path: 'comments', populate: { path: 'creator', select: '_id username image' } });
        postComments.comments.map(comment => {
            if (comment._id.toString() == commentId.toString()) {
                comment.message = commentMessage;
            }
        })
        postComments = await postComments.save();
        console.log(postComments.comments);
        res.status(200).json({
            comments: postComments.comments
        })


    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }


}