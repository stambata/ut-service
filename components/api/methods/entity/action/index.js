const jp = require('../../../ut-jsonpath');
const cryptoModel = {
    a: '$.a',
    b: '$.b'
};
exports.validation = function(joi) {
    return {
        description: 'add entity',
        params: joi.object().keys({
            a: joi.string(),
            b: joi.string(),
            c: joi.string()
        }),
        result: joi.any()
    };
};

exports.handler = function(msg, $meta) {
    var cryptoData = jp.extract(msg, cryptoModel);
    return this.bus.importMethod('crypto.record.add')({
        type: 'generic',
        data: cryptoData
    })
        .then(cryptoResult => {
            return this.bus.importMethod(`db/${$meta.method}`)(msg)
                .then(dbResult => {
                    return {success: true};
                });
        });
};
