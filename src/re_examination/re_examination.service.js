const models = require('../models');
const { v4: uuidv4 } = require('uuid');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const i18next = require('i18next');

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

const updateReExam = async (data) => {
  let reExam = await models.re_examination.findOne({ where: { id: data.id } });
  if (!reExam) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('reExamination.invalidID'));
  }
  reExam = Object.assign(reExam, data);
  return await reExam.save();
};

module.exports = {
  findOneByFilter,
  findAllByFilter,
  findAllByOption,
  findAndCountAllByCondition,
  createReExam,
  updateReExam,
};
