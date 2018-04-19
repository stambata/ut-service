exports.request = function(msg, $meta) {
    return {
        uri: '/api/record/bulk',
        httpMethod: 'post',
        payload: msg
    };
};
