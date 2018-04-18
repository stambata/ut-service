exports.request = function(msg, $meta) {
    return {
        uri: `/api/record/${msg.id}`,
        httpMethod: 'get'
    };
};

exports.response = function(msg, $meta) {
    return msg;
};
