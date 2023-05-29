const models = require('../models');
const { v4: uuidv4 } = require('uuid');

const findOneByFilter = async (filter) => {
  return await models.re_examination.findOne({ where: filter });
};

const findAllByFilter = async (filter) => {
  return await models.re_examination.findAll({ where: filter });
};

const findAllByOption = async (options = {}) => {
  return await models.re_examination.findAll(options);
};

const findAndCountAllByCondition = async (condition) => {
  return await models.re_examination.findAndCountAll(condition);
};

module.exports = {
  findOneByFilter,
  findAllByFilter,
  findAllByOption,
  findAndCountAllByCondition,
};
