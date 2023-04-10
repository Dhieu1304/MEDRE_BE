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
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already existed.');
    }
  }

  if (data.phone_number) {
    const user = await findOneByFilter({ phone_number: data.phone_number });
    if (user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already existed.');
    }
  }

  if (data.health_insurance) {
    const checkHealth = await findOneByFilter({ health_insurance: data.health_insurance });
    if (checkHealth && checkHealth.id != id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Health insurance already existed.');
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
    return await models.user.findOne({ where: filter });
};

const findAllByFilter = async (filter) => {
    return await models.user.findAll({ where: filter });
};

const findAndCountAllByCondition = async (condition) => {
    return await models.user.findAndCountAll(condition);
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

const changePassword = async (id, data) => {
  const user = await findOneByFilter({id:id});

  //check if password is correct
  const isPasswordMatch = await bcrypt.compare(data.old_password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect password.');
  }

  //check if new password and confirm password is match
  if (data.new_password !== data.confirm_password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'New password and confirm password do not match.');
  }

  const newPassword = await bcrypt.hash(data.new_password, 10);
  await user.update({ password: newPassword});
  return user;
}

module.exports = {
  createUser,
  findOneByFilter,
  findAllByFilter,
  editUser,
  changePassword,
  findAndCountAllByCondition,
};
