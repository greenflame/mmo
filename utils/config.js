let nconf = require('nconf');

nconf.file({
  file: './config/config.json'
});

module.exports = nconf;