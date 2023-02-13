const logger = require('../../config/logger');
const HistoryLogin = require('./history-login.model');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const findOneByFilter = async (filter) => {
  try {
    return await HistoryLogin.findOne(filter);
  } catch (e) {
    logger.error(e.messages);
  }
};

const createHistoryLogin = async (data) => {
  try {
    return await HistoryLogin.create(data);
  } catch (e) {
    logger.error(e.messages);
  }
};

const verifyToken = async (token) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await findOneByFilter({ token, userId: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

module.exports = {
  findOneByFilter,
  createHistoryLogin,
  verifyToken,
};
