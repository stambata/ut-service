const isEqual = require('lodash.isequal');
const errorsFactory = require('./errors');
module.exports = ({config = {}}) => {
    return {
        ports: [
            {
                id: 'crypto',
                createPort: require('ut-port-http'),
                logLevel: 'trace',
                imports: ['crypto'],
                url: 'http://127.0.0.1:8099',
                raw: {
                    json: true,
                    jar: true,
                    strictSSL: false
                },
                parseResponse: false,
                ready() {
                    if (!this.errors.crypto) {
                        Object.assign(this.errors, errorsFactory(this.defineError));
                    }
                    if (!this.config.autoSync) {
                        return;
                    }
                    const autoSync = Object.assign({
                        interval: 3000,
                        retries: 5
                    }, this.config.autoSync);
                    let counter = 0;
                    const checkHealth = () => {
                        return this.bus.importMethod(`crypto.health.check`)({})
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
                                    return this.bus.importMethod(`crypto.${entity}.get`)({documentType})
                                            .then(result => {
                                                if (!isEqual(items, result.items)) {
                                                    return this.bus.importMethod(`crypto.${entity}.update`)({
                                                        documentType,
                                                        items
                                                    });
                                                }
                                                return true;
                                            })
                                            .catch(e => {
                                                if (e.type && e.type === 'crypto.resourceNotFound') {
                                                    return this.bus.importMethod(`crypto.${entity}.add`)({
                                                        documentType,
                                                        items
                                                    });
                                                }
                                                throw e;
                                            });
                                }));
                            }));
                        });
                }
            }
        ],
        modules: {
            crypto: config.crypto && config.crypto.mock ? require('./mock')() : require('./handlers')
        }
    };
};
