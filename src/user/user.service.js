const User = require('./user.model');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger');

const createUser = async (data) => {
  if (await User.isEmailTaken(data.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(data);
};

const findOneByFilter = async (filter) => {
  try {
    return await User.findOne(filter);
  } catch (e) {
    logger.error(e.message);
  }
};

const findAllByFilter = async (filter) => {
  try {
    return await User.find(filter);
  } catch (e) {
    logger.error(e.message);
  }
};

module.exports = {
  createUser,
  findOneByFilter,
  findAllByFilter,
};
