exports.request = function(msg, $meta) {
    return {
        uri: '/api/configuration/index',
        httpMethod: 'post',
        payload: msg
    };
};
