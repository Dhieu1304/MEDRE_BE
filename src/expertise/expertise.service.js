const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const models = require('../models');
const logger = require('../config/logger');
const { v4: uuidv4 } = require('uuid');

const createExpertise = async (data) => {
  // check if expertise is exists
  const expertise = await findOneByFilter({ name: data.name });
  if (expertise) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Expertise already existed.');
  }

  // generate uuid
  data.id = uuidv4();

  // create new expertise
  return models.expertise.create(data);
};

const updateExpertise = async (data) => {
  // check if expertise's new name is exists
  const expertiseName = await findOneByFilter({ name: data.new_name });
  if (expertiseName) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Expertise already existed.');
  }

  //update expertise's name
  const expertise = await findOneByFilter({ name: data.old_name });
  expertise.name = data.new_name;
  await expertise.save();
  return expertise;
};

const deleteExpertise = async (data) => {
  //get expertise
  const expertise = await findOneByFilter({ name: data.name });
  if (!expertise) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Expertise not existed.');
  }

  //delete expertise
  return await models.expertise.destroy({ where: { id: expertise.id } });
};

const findOneByFilter = async (filter) => {
  try {
    return await models.expertise.findOne({ where: filter });
  } catch (e) {
    logger.error(e.message);
  }
};

const findAllByFilter = async (filter) => {
  try {
    return await models.expertise.findAll({ where: filter });
  } catch (e) {
    logger.error(e.message);
  }
};

const findAndCountAllByCondition = async (condition) => {
  try {
    return await models.staff.findAndCountAll(condition);
  } catch (e) {
    logger.error(e.message);
  }
};

module.exports = {
  createExpertise,
  updateExpertise,
  deleteExpertise,
  findOneByFilter,
  findAllByFilter,
  findAndCountAllByCondition,
};
