const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const models = require('../models');
const { v4: uuidv4 } = require('uuid');
const i18next = require('i18next');

const createExpertise = async (data) => {
  // check if expertise is exists
  const expertise = await findOneByFilter({ name: data.name });
  if (expertise) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('expertise.existed'));
  }

  // generate uuid
  data.id = uuidv4();

  // create new expertise
  return await models.expertise.create(data);
};

const updateExpertise = async (data) => {
  let expertise = await models.expertise.findOne({ where: { id: data.id } });
  if (!expertise) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid expertise');
  }
  if (data.name && expertise.name !== data.name) {
    // check if expertise's new name is exists
    const expertiseName = await findOneByFilter({ name: data.name });
    if (expertiseName) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('expertise.existed'));
    }
  }
  expertise = Object.assign(expertise, data);
  return await expertise.save();
};

const deleteExpertise = async (data) => {
  // get expertise
  const expertise = await findOneByFilter({ name: data.name });
  if (!expertise) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('expertise.notExisted'));
  }

  // delete expertise
  return await models.expertise.destroy({ where: { id: expertise.id } });
};

const findOneByFilter = async (filter) => {
  return await models.expertise.findOne({ where: filter });
};

const findAllByFilter = async (filter) => {
  return await models.expertise.findAll({ where: filter });
};

const findAndCountAllByCondition = async (condition) => {
  return await models.staff.findAndCountAll(condition);
};

module.exports = {
  createExpertise,
  updateExpertise,
  deleteExpertise,
  findOneByFilter,
  findAllByFilter,
  findAndCountAllByCondition,
};
