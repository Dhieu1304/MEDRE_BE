const models = require('../models');

const findAllByFilter = async (filter = {}) => {
  return await models.doctor_time_off.findAll(filter);
};

module.exports = {
  findAllByFilter,
};
