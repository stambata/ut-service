module.exports = () => {
    return {
        ports: [
            {
                id: 'console',
                createPort: require('ut-port-console')
            }
        ]
    };
};
