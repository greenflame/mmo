let express = require('express');
let config = require('./utils/config');
let logger = require('./utils/logger');
let loggerMiddleware = require('./utils/loggerMiddleware');


app = express();

app.use(loggerMiddleware);

app.route('/').get(function (req, res) {
  res.send('Hello, World!');
});

app.listen(config.get('express:port'), () => {
  logger.info('Listening on port ' + config.get('express:port'));
});