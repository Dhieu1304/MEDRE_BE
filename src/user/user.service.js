const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger');
const { v4: uuidv4 } = require('uuid');
const models = require('../models');
const bcrypt = require('bcryptjs');

const createUser = async (data) => {
  // check email is exist
  if (data.email) {
    const user = await findOneByFilter({ email: data.email });
    if (user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  }

  // hash password
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  // generate uuid
  data.id = uuidv4();

  // create new user
  return models.user.create(data);
};

const findOneByFilter = async (filter) => {
  try {
    return await models.user.findOne({ where: filter });
  } catch (e) {
    logger.error(e.message);
  }
};

const findAllByFilter = async (filter) => {
  try {
    return await models.user.findAll({ where: filter });
  } catch (e) {
    logger.error(e.message);
  }
};

const editUser = async (id, data) => {
  // check phone number is exists
  if (data.phone_number) {
    const checkPhone = await findOneByFilter({ phone_number: data.phone_number });
    if (checkPhone && checkPhone.id != id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already taken.');
    }
  }

  // check email is exists
  if (data.email) {
    const checkEmail = await findOneByFilter({ email: data.email });
    if (checkEmail && checkEmail.id != id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken.');
    }
  }

    // check health insurance is exists
    if (data.health_insurance) {
      const checkHealth = await findOneByFilter({ health_insurance: data.health_insurance });
      if (checkHealth && checkHealth.id != id) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Health insurance already existed.');
      }
    }

  //find user and update
  const user = await findOneByFilter({ id: id });
  if (data.phone_number) {
    await user.update({ phone_number: data.phone_number });
  }
  if (data.email) {
    await user.update({ email: data.email });
  }
  if (data.name) {
    await user.update({ name: data.name });
  }
  if (data.image) {
    await user.update({ image: data.image });
  }
  if (data.address) {
    await user.update({ address: data.address });
  }
  if (data.gender) {
    await user.update({ gender: data.gender });
  }
  if (data.dob) {
    await user.update({ dob: data.dob });
  }
  if (data.health_insurance) {
    await user.update({ health_insurance: data.health_insurance });
  }
};

module.exports = {
  createUser,
  findOneByFilter,
  findAllByFilter,
  editUser,
};
