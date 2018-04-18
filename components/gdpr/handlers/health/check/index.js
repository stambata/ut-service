exports.request = function(msg, $meta) {
    return {
        uri: '/actuator/health',
        httpMethod: 'get'
    };
};

exports.response = function(msg, $meta) {
    return msg;
};
