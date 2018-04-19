exports.request = function(msg, $meta) {
    return {
        uri: '/api/record/fetch',
        httpMethod: 'post',
        payload: msg
    };
};

