const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const authRouter = require('./routes/auth');

const postRouter = require('./routes/post');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(authRouter);
app.use(postRouter);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        error: {
            message: message,
            data: data
        }

    });
});


mongoose.connect(process.env.DB_URI, () => {
    app.listen(process.env.PORT, () => {
        console.log(`App is on fire from port ${process.env.PORT}`)
    });
});