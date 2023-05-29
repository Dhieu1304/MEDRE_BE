const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../config/logger');

const validateToken = async (token) => {
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    return {
      id: payload.sub,
      email: payload.email,
      phone_number: payload.phone_number,
      role: payload.role,
    };
  } catch (e) {
    logger.error(e.message);
    return false;
  }
};

module.exports = validateToken;
