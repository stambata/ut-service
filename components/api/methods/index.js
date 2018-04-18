const api = {
    entity: require('./entity')
};
const joi = require('joi');
const methods = {
    handlers: {},
    validations: {}
};
for (let entity in api) {
    for (let action in api[entity]) {
        methods.handlers[`${entity}.${action}`] = api[entity][action].handler;
        methods.validations[`${entity}.${action}`] = api[entity][action].validation(joi);
    }
};

module.exports = methods;
