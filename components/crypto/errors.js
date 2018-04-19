module.exports = (define) => {
    let errors = {};
    let create = (id, superType, message, level = 'error') => {
        let ErrorConstructor = define(id, superType, message, level);
        errors[ErrorConstructor.type] = ErrorConstructor;
        return ErrorConstructor;
    };
    create('crypto', null, 'crypto error', 'error');
    create('resourceNotFound', errors.crypto, 'Resource not found. Resource type: {resourceType}');
    return errors;
};
