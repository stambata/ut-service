const path = require('path');
module.exports = () => {
    return {
        ports: [
            {
                id: 'db',
                createPort: require('ut-port-sql'),
                logLevel: 'trace',
                createTT: true,
                createCRUD: true,
                linkSP: true,
                namespace: ['db/generic'],
                schema: [
                    {
                        path: path.join(__dirname, 'schema'),
                        linkSP: true
                    }
                ]
            }
        ]
    };
};
