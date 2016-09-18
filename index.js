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
  logger.info('A player connected');

  // Init player
  socket.player = {
    'id': socket.id,
    'position': {
      'x': 0,
      'y': 0
    }
  };

  // Send id and server state
  let players = [];

  for (var i in io.sockets.connected) {
    players.push(io.sockets.connected[i].player);
  }

  let serverState =  {
    'id': socket.player.id,
    'players': players
  };

  socket.emit('serverState', serverState);

  // Send info to others
  socket.broadcast.emit('playerConnected', socket.player);

  // On disconnect
  socket.on('disconnect', () => {
    logger.info('Player disconnected');
    io.emit('playerDisconnected', socket.player.id);
  });

  // On motion
  socket.on('playerMoved', (newPos) => {
    socket.player.position = newPos;
    io.emit('playerMoved', socket.player);
  });
});


server.listen(config.get('server:port'), (err) => {
  if (err) {
    logger.info('Can not start server');
  } else {
    logger.info('Server started on port: ' + config.get('server:port'));
  }
});