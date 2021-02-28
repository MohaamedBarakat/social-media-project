const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const authRouter = require('./routes/auth');

const app = express();

app.use(bodyParser.json());

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    console.log(data);
    res.status(status).json({
        message: message,
        data: data
    })
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(authRouter);

mongoose.connect(process.env.DB_URI, () => {
    app.listen(process.env.PORT, () => {
        console.log(`App is on fire from port ${process.env.PORT}`)
    });
});