const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const models = require('../models');
const bcrypt = require('bcryptjs');
const i18next = require('i18next');
//i18next.t('uncategory.loginSuccess')

const createUser = async (data) => {
  // check email is exist
  if (data.email) {
    const user = await findOneByFilter({ email: data.email });
    if (user) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('email.emailExisted'));
    }
  }

  if (data.phone_number) {
    const user = await findOneByFilter({ phone_number: data.phone_number });
    if (user) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('phone.phoneExisted'));
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
  // find user and update
  const user = await findOneByFilter({ id });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('account.notFound'));
  }

  const result = Object.assign(user, data);
  return await result.save();
};

const changePassword = async (id, data) => {
  //check if new password and confirm password is match
  if (data.new_password !== data.confirm_password) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('password.notMatch'));
  }

  const user = await findOneByFilter({ id });

  // check if password is correct
  const isPasswordMatch = await bcrypt.compare(data.old_password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.OK, i18next.t('password.passwordIncorrect'));
  }

  user.password = await bcrypt.hash(data.new_password, 10);
  return await user.save();
};

const getUserInfo = async (options) => {
  const user = await models.user.findOne(options);
  if (!user) {
    throw new ApiError(httpStatus.OK, i18next.t('account.notFound'));
  }
  return user;
};

module.exports = {
  createUser,
  findOneByFilter,
  findAllByFilter,
  editUser,
  changePassword,
  findAndCountAllByCondition,
  getUserInfo,
};
