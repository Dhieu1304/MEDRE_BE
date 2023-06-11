const models = require('../models');

const findAllByFilter = async (filter = {}) => {
  return await models.time_schedule.findAll(filter);
};

const findAllTimeSchedule = async () => {
  return await models.time_schedule.findAll({ order: ['time_start'] });
};

module.exports = {
  findAllByFilter,
  findAllTimeSchedule,
};
