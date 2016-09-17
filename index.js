let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

let config = require('./utils/config');
let logger = require('./utils/logger');
let loggerMiddleware = require('./utils/loggerMiddleware');


app.use(loggerMiddleware);
app.use('/', express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});


server.listen(config.get('server:port'), (err) => {
  if (err) {
    logger.info('Can not start server');
  } else {
    logger.info('Server started on port: ' + config.get('server:port'));
  }
});