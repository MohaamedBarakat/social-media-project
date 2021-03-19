const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

const feedsController = require('../controlles/feeds');

router.get('/feeds', isAuth, feedsController.feeds);

module.exports = router;