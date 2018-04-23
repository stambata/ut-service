module.exports = () => {
    return {
        ports: [
            {
                id: 'performance',
                createPort: require('ut-port-performance')
            }
        ]
    };
};
