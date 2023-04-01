const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const models = require('../models');
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');
const userService = require('../user/user.service');
const patientService = require('../patient/patient.service');
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
  const patient = await patientService.findOneByFilter({ id: data });
  if (staff) {
    return staff.role;
  }
  if (user) {
    const role = 'User';
    return role;
  }
  if (patient) {
    const role = 'Patient';
    return role;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found');
};

const blockingAccount = async (staffId, data) => {
  // get staff's role
  const staffRole = await getRole(staffId);

  // Check if staff id and block account id are the same
  if (staffId === data.id_account) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot block your own account.');
  }

  // Get role and data of block account
  const blockingAccountRole = await getRole(data.id_account);
  let account;
  if (blockingAccountRole === 'User') {
    account = await userService.findOneByFilter({ id: data.id_account });
  } else {
    account = await findOneByFilter({ id: data.id_account });
  }

  // Check the current status of the account
  if (account.status != 'Ok') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The account has already blocked or deleted.');
  }

  // generate uuid
  const id = uuidv4();

  // Nurse can block User
  if (staffRole === 'Nurse') {
    if (blockingAccountRole != 'User') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You do not have this permission.');
    }
  }

  // Doctor can block Nurse, User
  else if (staffRole === 'Doctor') {
    if (blockingAccountRole != 'Nurse' && blockingAccountRole != 'User') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You do not have this permission.');
    }
  }

  // Block the account and write into block_account table
  account.status = 'Block';
  await account.save();
  return models.blocking_account.create({
    id: id,
    id_staff: staffId,
    id_account: data.id_account,
    role: blockingAccountRole,
    type: 'Block',
    reason: data.reason,
  });
};

const unblockingAccount = async (staffId, data) => {
  //Get role and data of block account
  const unblockingAccountRole = await getRole(data.id_account);
  var account;
  if (unblockingAccountRole === 'User') {
    account = await userService.findOneByFilter({ id: data.id_account });
  } else {
    account = await findOneByFilter({ id: data.id_account });
  }

  //Check the current status of the account
  if (account.status === 'Ok') {
    throw new ApiError(httpStatus.BAD_REQUEST, "Don't need to unblock the account.");
  }

  // generate uuid
  const id = uuidv4();

  //Unblock the account and write into block_account table
  account.status = 'Ok';
  await account.save();
  return models.blocking_account.create({
    id: id,
    id_staff: staffId,
    id_account: data.id_account,
    role: unblockingAccountRole,
    type: 'Unblock',
    reason: data.reason,
  });
};

const findDetailStaff = async (filter) => {
  try {
    return await models.staff.findOne({
      where: filter,
      include: [{ model: models.expertise, as: 'id_expertise_expertises' }],
    });
  } catch (e) {
    logger.error(e.message);
  }
};

const getListStaff = async (listId) => {
  return await models.staff.findAll({
    where: { id: listId },
    include: [
      {
        model: models.expertise,
        as: 'id_expertise_expertises',
        attributes: { exclude: ['staff_expertise', 'createdAt', 'updatedAt'] },
      },
      // { model: models.schedule, as: 'staff_schedules', attributes: { exclude: ['createdAt', 'updatedAt'] } },
    ],
    attributes: { exclude: ['password', 'refresh_token', 'createdAt', 'updatedAt'] },
  });
};

const getListStaffSchedule = async (listId) => {
  return await models.staff.findAll({
    where: { id: listId },
    include: [{ model: models.schedule, as: 'staff_schedules', attributes: { exclude: ['createdAt', 'updatedAt'] } }],
    attributes: { exclude: ['password', 'refresh_token', 'createdAt', 'updatedAt'] },
  });
};

const editStaff = async (id, data) => {
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

  // check username is exists
  if (data.username) {
    const checkUsername = await findOneByFilter({ username: data.username });
    if (checkUsername && checkUsername.id != id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }
  }

  //find staff and update
  const staff = await findOneByFilter({ id: id });
  if (data.username) {
    await staff.update({ username: data.username });
  }
  if (data.phone_number) {
    await staff.update({ phone_number: data.phone_number });
  }
  if (data.email) {
    await staff.update({ email: data.email });
  }
  if (data.name) {
    await staff.update({ name: data.name });
  }
  if (data.image) {
    await staff.update({ image: data.image });
  }
  if (data.address) {
    await staff.update({ address: data.address });
  }
  if (data.gender) {
    await staff.update({ gender: data.gender });
  }
  if (data.dob) {
    await staff.update({ dob: data.dob });
  }
  if (data.role) {
    await staff.update({ role: data.role });
  }
  if (data.health_insurance) {
    await staff.update({ health_insurance: data.health_insurance });
  }
  if (data.description) {
    await staff.update({ description: data.description });
  }
  if (data.education) {
    await staff.update({ education: data.education });
  }
  if (data.certificate) {
    await staff.update({ certificate: data.certificate });
  }
};

module.exports = {
  createStaff,
  findOneByFilter,
  findAllByFilter,
  findExpertise,
  findAndCountAllByCondition,
  getRole,
  blockingAccount,
  findDetailStaff,
  getListStaff,
  getListStaffSchedule,
  unblockingAccount,
  editStaff,
};
