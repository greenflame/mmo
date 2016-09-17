let logger = require('./logger');
let expressWinston = require('express-winston');

let loggerMidleware = expressWinston.logger({
  winstonInstance: logger,
  meta: false,
  msg: '{{req.method}} {{req.url}} {{res.statusCode}} - {{res.responseTime}} ms'
});

module.exports = loggerMidleware;