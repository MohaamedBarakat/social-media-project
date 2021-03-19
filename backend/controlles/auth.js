const errorGenerator = require('../utils/errorGenerator');

const { validationResult } = require('express-validator/check');

const User = require('../models/user');

const bcrypt = require('bcrypt');

const sgMail = require('@sendgrid/mail');

const { clearImage } = require('../utils/main');

const jwt = require('jsonwebtoken');
const { find } = require('../models/user');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = (req, res, next) => {
    //console.log(req.body);
    const errors = validationResult(req);
    errorGenerator.validationError(errors);

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            if (!hashedPassword) {
                throw new Error('Server could not operate now');
            }
            const user = new User({
                email: email,
                username: username,
                password: hashedPassword,
                friends: [],
                requests: []

            });
            return user.save();
        })
        .then(result => {
            //console.log(result);
            const msg = {
                to: result.email,
                from: process.env.EMAIL_COMPANY,
                subject: 'Signup Succesful',
                text: `Thank You ${result.username} for Your Signup`,
                html: '<strong> Hello we are here for serving you Fell free to contact us !.... </strong>',
            }
            return sgMail.send(msg);
        })
        .then(result => {
            console.log('Email sent');
            res.status(201).json({ message: 'Signup Succesful' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })



}
exports.login = (req, res, next) => {
    //console.log(req.body);
    const error = validationResult(req);
    errorGenerator.validationError(error);
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    //console.log(req.body);
    User.findOne({ email: email })
        .then(user => {
            //console.log(user);
            if (!user) {
                errorGenerator.userNotFound();
            }
            loadedUser = user;
            return bcrypt.compare(password, loadedUser.password);
        })
        .then(isEqual => {
            //console.log(isEqual);
            if (!isEqual) {
                const error = new Error('Password not matched');
                error.statusCode = 401;
                throw error;
            }
            return jwt.sign({
                email: email,
                userId: loadedUser._id.toString()
            }, process.env.PRIVATE_KEY_TOKEN, { expiresIn: '3h' })
        })
        .then(token => {
            if (!token) {
                return new Error('Could not generate token');
            }
            //console.log(token);
            res.status(200).json({
                token: token,
                userId: loadedUser._id.toString()
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}
exports.user = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
        .populate('posts')
        .then(user => {
            if (!user) {
                errorGenerator.userNotFound();
            }
            //console.log(user);
            res.status(200).json({ message: 'user fetched', user: user });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
exports.searchUsers = (req, res, next) => {
    const users = req.body.users;
    User.find({ username: { $regex: "^" + users, $options: 'i' } }, '_id username image')
        .then(users => {
            console.log(users);
            res.json({ users: users });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })

}
exports.updateImage = (req, res, next) => {
    if (!req.file) {
        const error = new Error('Image not found');
        throw error;
    }
    let image;
    if (req.file) {
        image = req.file.path;
    }
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                errorGenerator.userNotFound();
            }
            if (image !== user.image && user.image) {
                clearImage(user.image);
            }
            user.image = image;
            return user.save();
        }).then(user => {
            res.status(201).json({ message: 'image updated', user: user });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.userFriends = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
        .then(user => {
            if (!user) {
                errorGenerator.userNotFound();
            }
            if (!userId) {
                errorGenerator.badRequest();
            }
            res.status(200).json({ userFriends: user.friends, userRequests: user.requests })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};
exports.addFriend = (req, res, next) => {
    const addUserId = req.params.userId;
    //console.log(userId);
    User.findById(addUserId)
        .then(user => {
            if (!user) {
                errorGenerator.userNotFound();
            }
            if (user.requests.includes(req.userId) || !addUserId) {
                errorGenerator.badRequest();
            }
            user.requests.push(req.userId);
            return user.save();
        })
        .then(user => {
            console.log('user added ', user.requests);
            res.status(200).json({
                userRequests: user.requests
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};
exports.cancelRequest = (req, res, next) => {
    const cancelUserId = req.params.userId;
    //console.log(cancelUserId);
    User.findById(cancelUserId)
        .then(user => {
            if (!user) {
                errorGenerator.userNotFound();
            }
            //console.log(user.requests.includes(req.userId));
            //console.log(user.requests, req.userId);
            if (!user.requests.includes(req.userId.toString()) || !cancelUserId) {
                errorGenerator.badRequest();
            }
            user.requests.pull(req.userId);
            return user.save();
        })
        .then(user => {
            res.status(200).json({
                userRequests: user.requests
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};
exports.requests = (req, res, next) => {
    User.findById(req.userId)
        .populate({ path: 'requests', select: '_id image username' })
        .then(user => {
            if (!user) {
                errorGenerator.userNotFound();
            }
            console.log(user.requests);
            res.status(200).json({ requests: user.requests })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
exports.confirmRequest = async(req, res, next) => {
    const userRquestId = req.params.userId;
    let ownerUser;
    User.find({ _id: { $in: [req.userId, userRquestId] } })
        .then(users => {
            if (users.length < 2) {
                errorGenerator.userNotFound();
            }
            if (!userRquestId) {
                errorGenerator.badRequest();
            }
            users.map(user => {
                if (user._id.toString() === req.userId.toString()) {
                    ownerUser = user;
                    if (!user.requests.includes(userRquestId)) {
                        errorGenerator.badRequest();
                    }
                } else {
                    user.friends.push(req.userId);
                    user.save();
                }
            });
            ownerUser.requests.pull(userRquestId);
            ownerUser.friends.push(userRquestId);
            return ownerUser.save();

        })
        .then(user => {
            return user
                .populate({ path: 'requests', select: '_id image username' })
                .execPopulate()
        })
        .then(user => {
            res.status(200).json({
                requests: user.requests
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};
exports.ignoreRequest = (req, res, next) => {
    const userRquestId = req.params.userId;
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                errorGenerator.userNotFound();
            }
            //console.log(userRquestId);
            //console.log(user.requests.includes(userRquestId));
            if (!user.requests.includes(userRquestId.toString()) || !userRquestId) {
                errorGenerator.badRequest();
            }
            user.requests.pull(userRquestId);
            return user.save();
        })
        .then(user => {
            return user
                .populate({ path: 'requests', select: '_id image username' })
                .execPopulate();
        })
        .then(user => {
            res.status(200).json({
                requests: user.requests
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};
exports.unfriend = (req, res, next) => {
    const unFrienduserId = req.params.userId;
    let isFriend;
    User.find({ _id: { $in: [req.userId, unFrienduserId] } })
        .then(users => {
            if (!users) {
                errorGenerator.userNotFound();
            }
            users.map(user => {
                isFriend = (user._id.toString() === req.userId.toString() ? user.friends.includes(unFrienduserId) : user.friends.includes(req.userId));
                if (!isFriend) {
                    errorGenerator.badRequest();
                }
            });
            users.map(user => {
                user._id.toString() === req.userId.toString() ? user.friends.pull(unFrienduserId) : user.friends.pull(req.userId)
                user.save();
            });
            return users;
        })
        .then(users => {
            res.status(200).json({
                messgae: 'user unfriended'
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};
exports.userData = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId, '_id username image')
        .then(user => {
            if (!user) {
                errorGenerator.userNotFound();
            }
            if (!userId) {
                errorGenerator.badRequest();
            }
            res.status(200).json({
                user: user
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}