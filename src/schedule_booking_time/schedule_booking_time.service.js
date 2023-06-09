const models = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

const findAndCountAllByCondition = async (condition) => {
  return await models.schedule_booking_time.findAndCountAll(condition);
};

module.exports = {
  findAndCountAllByCondition,
};
