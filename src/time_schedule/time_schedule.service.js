const models = require('../models');
const logger = require('../config/logger');

const findAllByFilter = async (filter = {}) => {
  try {
    return await models.time_schedule.findAll(filter);
  } catch (e) {
    logger.error(e.message);
  }
};

module.exports = {
  findAllByFilter,
};
