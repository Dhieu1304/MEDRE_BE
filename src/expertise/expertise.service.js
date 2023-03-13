const models = require('../models');

const findAllByFilter = async (filter) => {
  return await models.expertise.findAll({ where: filter });
};

module.exports = {
  findAllByFilter,
};
