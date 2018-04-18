const methods = require('./methods');
module.exports = () => {
    return {
        ports: [
            {
                id: 'script',
                createPort: require('ut-port-script'),
                imports: ['generic']
            },
            {
                id: 'httpserver',
                createPort: require('ut-port-httpserver'),
                logLevel: 'trace',
                port: 9999,
                api: ['generic'],
                routes: {
                    rpc: {
                        method: 'post',
                        path: '/rpc/{method?}',
                        config: {
                            app: {
                                skipIdentityCheck: true
                            },
                            tags: ['rpc'],
                            auth: false
                        }
                    }
                }
            }
        ],
        modules: {
            generic: methods.handlers
        },
        validations: {
            generic: methods.validations
        }
    };
};
