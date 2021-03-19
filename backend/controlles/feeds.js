const User = require('../models/user');

const Post = require('../models/post');


exports.feeds = async(req, res, next) => {
    try {
        const freinds = await User.findById(req.userId, 'friends');
        const posts = await Post
            .find({ creator: { $in: [...freinds.friends] } })
            .populate({ path: 'creator', select: '_id username image' }).sort({ updatedAt: -1 });
        //console.log(posts);
        res.status(200).json({
            posts: posts
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}