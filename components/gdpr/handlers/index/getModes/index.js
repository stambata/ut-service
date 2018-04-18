exports.request = function(msg, $meta) {
    return {
        uri: '/api/configuration/index/modes',
        httpMethod: 'get'
    };
};

exports.response = function(msg, $meta) {
    return msg;
};
