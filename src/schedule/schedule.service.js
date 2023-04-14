const models = require('../models');

const findOneByFilter = async (filter) => {
  return await models.schedule.findOne({ where: filter });
};

const findAllByFilter = async (filter) => {
  return await models.schedule.findAll({ where: filter });
};

const findAllByOption = async (options = {}) => {
  return await models.schedule.findAll(options);
};

const createSchedule = async (data) => {
  return await models.schedule.bulkCreate(data);
};

module.exports = {
  findOneByFilter,
  findAllByFilter,
  findAllByOption,
  createSchedule,
};
