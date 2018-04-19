exports.request = function(msg, $meta) {
    return {
        uri: `/api/configuration/constraint/${msg.documentType}`,
        httpMethod: 'get'
    };
};

exports.error = function(err, $meta) {
    if (err && err.code === 404) {
        throw this.errors['crypto.resourceNotFound']({params: {
            resourceType: 'constraint'
        }});
    }
    throw err;
};
