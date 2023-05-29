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

const createReExam = async (data) => {
  data.id = uuidv4();
  return models.re_examination.create(data);
};

module.exports = {
  findOneByFilter,
  findAllByFilter,
  findAllByOption,
  findAndCountAllByCondition,
  createReExam,
};
