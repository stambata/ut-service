const components = [
    require('../components/console'),
    require('../components/db'),
    require('../components/gdpr'),
    require('../components/api')
];

module.exports = params => components.map(component => component(params));
