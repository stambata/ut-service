exports.request = function(msg, $meta) {
    return {
        uri: '/api/record',
        httpMethod: 'put',
        payload: msg
    };
};

exports.response = function(msg, $meta) {
    return msg;
};
