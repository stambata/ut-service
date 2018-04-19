exports.request = function(msg, $meta) {
    return {
        uri: '/api/record',
        httpMethod: 'put',
        payload: msg
    };
};
