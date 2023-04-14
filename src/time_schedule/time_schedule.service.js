const models = require('../models');

const findAllByFilter = async (filter = {}) => {
  return await models.time_schedule.findAll(filter);
};

module.exports = {
  findAllByFilter,
};
