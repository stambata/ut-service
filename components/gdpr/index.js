const isEqual = require('lodash.isequal');
module.exports = ({config = {}}) => {
    const namespace = typeof config.gdprNamespace === 'string' ? config.gdprNamespace : 'gdpr';
    const service = {
        ports: [
            {
                id: namespace,
                createPort: require('ut-port-http'),
                logLevel: 'trace',
                imports: [namespace],
                url: 'http://127.0.0.1:8099',
                ready() {
                    if (!this.config.autoSync) {
                        return;
                    }
                    const autoSync = Object.assign({
                        interval: 3000,
                        retries: 5
                    }, this.config.autoSync);
                    let counter = 0;
                    const checkHealth = () => {
                        return this.bus.importMethod(`${namespace}.health.check`)({})
                            .catch((err) => {
                                if (++counter < autoSync.retries) {
                                    return new Promise(resolve => {
                                        setTimeout(() => {
                                            resolve(checkHealth());
                                        }, autoSync.interval);
                                    });
                                }
                                throw err;
                            });
                    };
                    return checkHealth()
                        .then(() => {
                            const documentTypes = Object.keys(this.config.documents || {});
                            return Promise.all(documentTypes.map(documentType => {
                                const entities = Object.keys(this.config.documents[documentType] || {});
                                return Promise.all(entities.map(entity => {
                                    const items = this.config.documents[documentType][entity] || [];
                                    return this.bus.importMethod(`${namespace}.${entity}.get`)({documentType})
                                            .then(result => {
                                                if (!result.items.length) {
                                                    return this.bus.importMethod(`${namespace}.${entity}.add`)({
                                                        documentType,
                                                        items
                                                    });
                                                }
                                                if (!isEqual(items, result.items)) {
                                                    return this.bus.importMethod(`${namespace}.${entity}.update`)({
                                                        documentType,
                                                        items
                                                    });
                                                }
                                                return true;
                                            });
                                }));
                            }));
                        });
                }
            }
        ]
    };
    service.modules = {};
    if (config[namespace] && config[namespace].mock) {
        service.modules[namespace] = require('./mock')();
    } else {
        service.modules[namespace] = require('./handlers');
    }
    return service;
};
