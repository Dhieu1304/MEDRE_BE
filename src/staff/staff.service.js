const models = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger');

const createStaff = async (data) => {
  if (await models.staff.findOne(data.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
  return models.staff.create(data);
};

const findOneByFilter = async (filter) => {
  try {
    return await models.staff.findOne({ where: filter });
  } catch (e) {
    logger.error(e.message);
  }
};

const findAllByFilter = async (filter) => {
  try {
    return await models.staff.findAll({ where: filter });
  } catch (e) {
    logger.error(e.message);
  }
};

const findExpertise = async (data) => {
  try {
    console.log('d', data);
    const staffExpertise = await models.staff_expertise.findAll({
      where: { id_staff: data.staffId },
      attributes: ['id_expertise'],
      include: [{ model: models.expertise, as: 'id_expertise_expertise', attributes: ['name'] }],
    });
    return staffExpertise;
  } catch (e) {
    logger.error(e.message);
  }
};

module.exports = {
  createStaff,
  findOneByFilter,
  findAllByFilter,
  findExpertise,
};
