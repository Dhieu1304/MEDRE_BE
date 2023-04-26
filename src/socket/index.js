const logger = require('../config/logger');
const authSocket = require('./socket.auth');
const { SOCKET_EVENT } = require('./socket.constant');

const SocketServer = (io) => {
  io.use(authSocket());

  io.on('connection', async (socket) => {
    logger.info(`New socket connection ${socket.id} ${socket.user.id}`);
    socket.emit(SOCKET_EVENT.NOTIFICATION, 'Connect socket successfully');

    socket.on('disconnect', () => {
      logger.info(`Socket disconnect ${socket.id} ${socket.user.id}`);
    });
  });
};

module.exports = {
  SocketServer,
};
