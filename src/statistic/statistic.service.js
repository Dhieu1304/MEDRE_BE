const models = require('../models');

const findAllStatisticByCondition = async (table, condition = {}) => {
  return await models[table].findAll(condition);
};

module.exports = {
  findAllStatisticByCondition,
};
