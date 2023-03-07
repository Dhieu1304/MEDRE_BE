const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const models = require('../models');
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const createStaff = async (data) => {
  // check email is exists
  if (data.email) {
    const staff = await findOneByFilter({ email: data.email });
    if (staff) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  }

  // check username is exists
  if (data.username) {
    const staff1 = await findOneByFilter({ username: data.username });
    if (staff1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }
  }

  // hash password
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  // generate uuid
  data.id = uuidv4();

  // create new user
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
