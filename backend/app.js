const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const authRouter = require('./routes/auth');

const postRouter = require('./routes/post');

const feedsRouter = require('./routes/feeds');

const multer = require('multer');

const path = require('path');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (rea, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
})
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
app.use(bodyParser.json());

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(authRouter);
app.use(postRouter);
app.use(feedsRouter);
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