const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const models = require('../models');
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');
const userService = require('../user/user.service');
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
  const staff = await findOneByFilter({ username: data.username });
  if (staff) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
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

const findAndCountAllByCondition = async (condition) => {
  try {
    return await models.staff.findAndCountAll(condition);
  } catch (e) {
    logger.error(e.message);
  }
};

const findExpertise = async (data) => {
  try {
    return await models.staff_expertise.findAll({
      where: { id_staff: data.staffId },
      attributes: ['id_expertise'],
      include: [{ model: models.expertise, as: 'id_expertise_expertise', attributes: ['name'] }],
    });
  } catch (e) {
    logger.error(e.message);
  }
};

const getRole = async (data) => {
  const staff = await findOneByFilter({ id: data });
  const user = await userService.findOneByFilter({ id: data });
  if (staff != null) {
    return staff.role;
  }
  if (user) {
    const role = 'User';
    return role;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found');
};

const blockingAccount = async (staffId, data) => {
  //get staff's role
  const staffRole = await getRole(staffId);
  console.log('2: ', staffRole);
  //Check if staff id and block account id are the same
  if (staffId === data.id_account) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot block your own account.');
  }

  //Get role and data of block account
  const blockingAccountRole = await getRole(data.id_account);
  console.log('2: ', blockingAccountRole);
  var account;
  if (blockingAccountRole === 'User') {
    account = await userService.findOneByFilter({ id: data.id_account });
  } else {
    account = await findOneByFilter({ id: data.id_account });
  }

  //Check the current status of the account
  if (account.status != 'Ok') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The account has already blocked or deleted.');
  }

  // generate uuid
  const id = uuidv4();

  //Nurse can block User
  if (staffRole === 'Nurse') {
    if (blockingAccountRole != 'User') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You have no right to block the account.');
    }
  }

  //Doctor can block Nurse, User
  else if (staffRole === 'Doctor') {
    if (blockingAccountRole != 'Nurse' && blockingAccountRole != 'User') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You have no right to block the account.');
    }
  }

  //Block the account and write into block_account table
  account.status = 'Block';
  await account.save();
  return models.blocking_account.create({
    id: id,
    id_staff: staffId,
    id_account: data.id_account,
    role: blockingAccountRole,
    reason: data.reason,
  });
};

module.exports = {
  createStaff,
  findOneByFilter,
  findAllByFilter,
  findExpertise,
  findAndCountAllByCondition,
  getRole,
  blockingAccount,
};
