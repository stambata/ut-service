const jp = require('../../../ut-jsonpath');
const gdprModel = {
    data: {
        a: '$.data.a',
        b: '$.data.b'
    }
};
exports.validation = function(joi) {
    return {
        description: 'add entity',
        params: joi.object().keys({
            data: joi.object().keys({
                a: joi.string(),
                b: joi.string(),
                c: joi.string()
            })
        }),
        result: joi.any()
    };
};

exports.handler = function(msg, $meta) {
    var gdprData = jp.extract(msg, gdprModel);
    return this.bus.importMethod('gdpr.record.add')(gdprData)
        .then(gdprResult => {
            return this.bus.importMethod(`db/${$meta.method}`)(msg)
                .then(dbResult => {
                    return {success: true};
                });
        });
};
