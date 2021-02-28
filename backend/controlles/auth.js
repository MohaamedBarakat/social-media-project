const errorGenerator = require('../utils/errorGenerator');

const { validationResult } = require('express-validator/check');

const User = require('../models/user');

const bcrypt = require('bcrypt');

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.putSignup = (req, res, next) => {
    //console.log(req.body);
    const error = validationResult(req);
    errorGenerator.validationError(error);
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
            const msg = {
                to: result.email, // Change to your recipient
                from: process.env.EMAIL_COMPANY, // Change to your verified sender
                subject: 'Signup Succesful',
                text: `Thank You ${result.usename} for Your Signup`,
                html: '<strong> Hello we are here for serving you Fell free to contact with us !.... </strong>',
            }
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
        })
        .then(result => {
            /*if (result.statusCode !== 200 || result.statusCode !== 201) {
                const error = new Error('Server could not operate now');
                error.statusCode = result.statusCode;
                throw error;
            }*/
            res.status(201).json({ message: 'Signup Succesful' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}