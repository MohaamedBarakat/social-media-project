const User = require('../models/user');

const Post = require('../models/post');

exports.feeds = async(req, res, next) => {
    try {
        const freinds = await User.findById(req.userId, 'friends');
        //console.log(freinds.friends);
        const setFriends = freinds.friends.map(friend => friend.userId);
        //console.log(setFriends);
        const posts = await Post
            .find({ creator: { $in: [...setFriends] } })
            .populate({ path: 'creator', select: '_id firstname lastname image' }).sort({ createdAt: -1 });
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