const utRun = require('ut-run');
const packageJson = require('./package.json');
utRun.run({
    version: packageJson.version
});
