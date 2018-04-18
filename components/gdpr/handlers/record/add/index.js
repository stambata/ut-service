exports.request = function(msg, $meta) {
    return {
        uri: '/api/record',
        httpMethod: 'post',
        payload: msg
    };
};

exports.response = function(msg, $meta) {
    return msg;
};
