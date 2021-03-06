const authController = require('../controlles/auth');

const User = require('../models/user');

const express = require('express');

const { body } = require('express-validator/check');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.put('/signup', [
    body('email', "Invalid Email")
    .trim()
    .isEmail()
    .custom(async(value) => {
        const user = await User.findOne({ email: value })
        if (user) {
            //console.log(user);
            const error = new Error('E-mail is already exist');
            error.statusCode = 422;
            throw error;
        }
        return true;
    }),
    body('firstname', 'Inavlid Firstname')
    .isLength({ min: 2 })
    .trim(),
    body('lastname', 'Inavlid Lastname')
    .isLength({ min: 2 })
    .trim(),
    body('phonenumber', 'Inavlid phone number')
    .isLength({ min: 11, max: 11 })
    .trim(),
    body('password', 'Invalid Password')
    .trim()
    .isLength({ min: 5 }),
    body('confirmPassword', 'Password Not Matched')
    .trim()
    .isLength({ min: 5 })
    .custom((value, { req, next }) => {
        if (value !== req.body.password) {
            const error = new Error('Password confirmation does not match password');
            error.statusCode = 422;
            throw error;
        }
        return true;
    })
], authController.signup);

router.post('/login', [
    body('email', 'Invalid email')
    .trim()
    .isEmail()
    .custom(async(value) => {
        const user = await User.findOne({ email: value });
        if (!user) {
            const error = new Error('Email dose not exist');
            error.statusCode = 401;
            throw error;
        } else { return true; }

    }),
    body('password', 'Invalid password')
    .trim()
    .isLength({ min: 5 })

], authController.login);

router.get('/profile/:userId', isAuth, authController.user);

router.post('/users/search', [
    body('users', 'invalid search')
    .trim()
    .isLength({ min: 1 })
], isAuth, authController.searchUsers);

router.get('/data/user/:userId', isAuth, authController.userData);

router.patch('/user/update-profile-image', isAuth, authController.updateImage);

router.get('/user/:userId', isAuth, authController.userFriends);

router.put('/add-friend/user/:userId', isAuth, authController.addFriend);

router.patch('/cancel-request/user/:userId', isAuth, authController.cancelRequest);

router.get('/requests', isAuth, authController.requests);

router.patch('/request/confirm/:userId', isAuth, authController.confirmRequest);

router.patch('/request/ignore/:userId', isAuth, authController.ignoreRequest);

router.patch('/unfriend/:userId', isAuth, authController.unfriend);

module.exports = router;