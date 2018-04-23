const components = [
    require('../components/api'),
    require('../components/console'),
    require('../components/crypto'),
    require('../components/db'),
    require('../components/performance')
];

module.exports = params => components.map(component => component(params));
