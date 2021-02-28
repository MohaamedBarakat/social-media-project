const authController = require('../controlles/auth');

const User = require('../models/user');

const express = require('express');

const { body } = require('express-validator/check');

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
    body('username', 'Inavlid Username')
    .isLength({ min: 2 })
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



], authController.putSignup);

module.exports = router;