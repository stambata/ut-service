exports.request = function(msg, $meta) {
    return {
        uri: '/api/record/fetch/query',
        httpMethod: 'post',
        payload: msg
    };
};
