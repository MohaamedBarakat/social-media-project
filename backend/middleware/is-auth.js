const jwt = require('jsonwebtoken');
const errorGenrator = require('../utils/errorGenerator');
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        errorGenrator.notAuth();
    }
    const Bearer = authHeader.split(' ');
    const token = Bearer[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.PRIVATE_KEY_TOKEN);

    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        errorGenrator.notAuth();
    }
    req.userId = decodedToken.userId;
    next();
};