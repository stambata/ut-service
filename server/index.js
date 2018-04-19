const components = [
    require('../components/console'),
    require('../components/db'),
    require('../components/crypto'),
    require('../components/api')
];

module.exports = params => components.map(component => component(params));
