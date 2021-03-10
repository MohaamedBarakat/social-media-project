exports.validationError = errors => {
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        error.data = errors.array();
        //console.log(error.data);
        throw error;
    }
}
exports.userNotFound = () => {
    const error = new Error('User could not found');
    error.statusCode = 401;
    throw error;
};
exports.notAuth = () => {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
}
exports.forbidden = () => {
    const error = new Error('This user forbidden from this action');
    error.status = 401;
    throw error;
}
exports.badRequest = () => {
    const error = new Error('We can not perform this operation');
    error.status = 400;
    throw error;
}