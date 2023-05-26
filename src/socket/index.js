const logger = require('../config/logger');
const { SOCKET_EVENT } = require('./socket.constant');
const validateToken = require('./socket.validateToken');
const { NOTIFICATION_FOR } = require('../notification/notification.constant');

const SocketServer = (io) => {
  io.on('connection', async (socket) => {
    logger.info(`New socket connection ${socket.id}`);
    socket.emit(SOCKET_EVENT.SUCCESS, 'Connect socket successfully');

    socket.on(SOCKET_EVENT.JOIN_ROOM, async (token) => {
      const user = await validateToken(token);
      if (!user) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Incorrect token!');
      }
      socket.join(user.id);
      socket.join(user.role);
      socket.join(NOTIFICATION_FOR.ALL_SYSTEM);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnect ${socket.id}`);
    });
  });
};

module.exports = {
  SocketServer,
};
