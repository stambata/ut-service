const common = require('../server/common');
common.service = 'master';
common.runWorker = false;
common.masterBus.socket = {
    port: 9000
};
module.exports = common;
