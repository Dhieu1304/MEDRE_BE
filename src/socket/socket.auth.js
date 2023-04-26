const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../config/logger');
const i18next = require('i18next');

const authSocket = () => {
  return async (socket, next) => {
    const header = socket.handshake.headers.authorization;

    if (!header) {
      return next(new Error(i18next.t('error.unauthorized')));
    }

    const parts = header.split(' ');
    if (parts.length !== 2 && parts[0] !== 'Bearer') {
      return next(new Error(i18next.t('error.unauthorized')));
    }

    const token = parts[1];

    try {
      const payload = jwt.verify(token, config.jwt.secret);
      socket.user = {
        id: payload.sub,
        email: payload.email,
        phone_number: payload.phone_number,
        role: payload.role,
      };
      next();
    } catch (e) {
      logger.error(e.message);
      return next(new Error(e.message));
    }
  };
};

module.exports = authSocket;
