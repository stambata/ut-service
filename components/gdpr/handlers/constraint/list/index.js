exports.request = function(msg, $meta) {
    return {
        uri: '/api/configuration/constraint',
        httpMethod: 'get'
    };
};

exports.response = function(msg, $meta) {
    return msg;
};
