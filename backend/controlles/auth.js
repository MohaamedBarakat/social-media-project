const errorGenerator = require('../utils/errorGenerator');

const { validationResult } = require('express-validator/check');

const User = require('../models/user');

const bcrypt = require('bcrypt');

const sgMail = require('@sendgrid/mail');

const jwt = require('jsonwebtoken');

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
                password: hashedPassword

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
            }, process.env.PRIVATE_KEY_TOKEN, { expiresIn: '2h' })
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
    //console.log(userId);
    res.status(200).json({ userId });
}