const common = require('../master/common');
common.runMaster = false;
common.runWorker = true;
module.exports = common;
