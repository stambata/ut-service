exports.request = function(msg, $meta) {
    return {
        uri: '/api/configuration/constraint',
        httpMethod: 'put',
        payload: msg
    };
};

exports.response = function(msg, $meta) {
    return msg;
};
