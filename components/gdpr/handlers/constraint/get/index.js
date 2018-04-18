exports.request = function(msg, $meta) {
    return {
        uri: `/api/configuration/constraint/${msg.documentType}`,
        httpMethod: 'get'
    };
};

exports.response = function(msg, $meta) {
    return msg;
};

exports.error = function(msg, $meta) {
    // TODO: move this code to response later when status code of not existing records becomes 204
    $meta.mtid = 'response';
    return {
        items: []
    };
};
