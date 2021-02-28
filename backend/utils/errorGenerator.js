exports.validationError = errors => {
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed ' + errors.array()[0].msg);
        error.statusCode = 422;
        error.data = errors.array();
        //console.log(error.data);
        throw error;
    }
}