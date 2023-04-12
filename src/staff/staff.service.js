const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const models = require('../models');
const bcrypt = require('bcryptjs');
const userService = require('../user/user.service');
const patientService = require('../patient/patient.service');
const { v4: uuidv4 } = require('uuid');
const { STAFF_ROLES } = require('./staff.constant');
const { BLOCK_ACCOUNT_TYPE } = require('../blocking_account/blocking_account.constant');
const i18next = require('i18next');
//i18next.t('uncategory.loginSuccess')

const createStaff = async (data) => {
  // check email is exists
  if (data.email) {
    const staff = await findOneByFilter({ email: data.email });
    if (staff) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('email.emailExisted'));
    }
  }

  // check username is exists
  const staff = await findOneByFilter({ username: data.username });
  if (staff) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('username.usernameExisted'));
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
  return await models.staff.findOne({ where: filter });
};

const findOneByOption = async (options) => {
  return await models.staff.findOne(options);
};

const findAllByFilter = async (filter) => {
  return await models.staff.findAll({ where: filter });
};

const findAndCountAllByCondition = async (condition) => {
  return await models.staff.findAndCountAll(condition);
};

const getRole = async (data) => {
  const staff = await findOneByFilter({ id: data });
  if (staff) {
    return staff.role;
  }
  const user = await userService.findOneByFilter({ id: data });
  if (user) {
    return 'User';
  }
  const patient = await patientService.findOneByFilter({ id: data });
  if (patient) {
    return 'Patient';
  }
  throw new ApiError(httpStatus.BAD_REQUEST,  i18next.t('account.notFound'));
};

const blockingAccount = async (staffId, data) => {
  // get staff's role
  const staffRole = await getRole(staffId);

  // Check if staff id and block account id are the same
  if (staffId === data.id_account) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('block.blockOwnAccount'));
  }

  // Get role and data of block account
  const blockingAccountRole = await getRole(data.id_account);
  let account;
  if (blockingAccountRole === 'User') {
    account = await userService.findOneByFilter({ id: data.id_account });
  } else {
    account = await findOneByFilter({ id: data.id_account });
  }

  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('account.notFound'));
  }

  if (account.blocked) {
    throw new ApiError(httpStatus.OK, i18next.t('block.alreadyBlocked'));
  }

  // Nurse can block User
  if (staffRole === STAFF_ROLES.NURSE) {
    if (blockingAccountRole !== 'User') {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('uncategory.permission'));
    }
  }

  // Doctor can block Nurse, User
  else if (staffRole === STAFF_ROLES.DOCTOR) {
    if (blockingAccountRole !== STAFF_ROLES.NURSE && blockingAccountRole !== 'User') {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('uncategory.permission'));
    }
  }

  // Block the account and write into block_account table
  const blockAccount = await models.blocking_account.create({
    id: uuidv4(),
    id_staff: staffId,
    id_account: data.id_account,
    role: blockingAccountRole,
    type: BLOCK_ACCOUNT_TYPE.BLOCK,
    reason: data.reason,
  });

  // update blocked status
  account.blocked = true;
  account.refresh_token = '';
  await account.save();

  return blockAccount;
};

const unblockingAccount = async (staffId, data) => {
  // Get role and data of block account
  const unblockingAccountRole = await getRole(data.id_account);
  let account;
  if (unblockingAccountRole === 'User') {
    account = await userService.findOneByFilter({ id: data.id_account });
  } else {
    account = await findOneByFilter({ id: data.id_account });
  }

  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('account.notFound'));
  }

  if (!account.blocked) {
    throw new ApiError(httpStatus.OK, i18next.t('block.alreadyUnblocked'));
  }

  // Unblock the account and write into block_account table
  const unBlockAccount = await models.blocking_account.create({
    id: uuidv4(),
    id_staff: staffId,
    id_account: data.id_account,
    role: unblockingAccountRole,
    type: BLOCK_ACCOUNT_TYPE.UNBLOCK,
    reason: data.reason,
  });

  // update blocked status
  account.blocked = false;
  await account.save();

  return unBlockAccount;
};

const findDetailStaff = async (filter) => {
  return await models.staff.findOne({
    where: filter,
    include: [{ model: models.expertise, as: 'id_expertise_expertises' }],
  });
};

const editStaff = async (id, data) => {
  // check phone number is exists
  if (data.phone_number) {
    const checkPhone = await findOneByFilter({ phone_number: data.phone_number });
    if (checkPhone && checkPhone.id !== id) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('phone.phoneExisted'));
    }
  }

  // check email is exists
  if (data.email) {
    const checkEmail = await findOneByFilter({ email: data.email });
    if (checkEmail && checkEmail.id !== id) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('email.emailExisted'));
    }
  }

  // check username is exists
  if (data.username) {
    const checkUsername = await findOneByFilter({ username: data.username });
    if (checkUsername && checkUsername.id !== id) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('username.usernameExisted'));
    }
  }
  // find staff and update
  const staff = await findOneByFilter({ id });
  const result = Object.assign(staff, data);
  return await result.save();
};

const changePassword = async (id, data) => {
  const staff = await findOneByFilter({ id: id });

  // check if password is correct
  const isPasswordMatch = await bcrypt.compare(data.old_password, staff.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('password.passwordIncorrect'));
  }

  // check if new password and confirm password is match
  if (data.new_password !== data.confirm_password) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('password.notMatch'));
  }

  const newPassword = await bcrypt.hash(data.new_password, 10);
  await staff.update({ password: newPassword });
  return staff;
};

// Find elements have in array left but not have in array right
const findDifference = async (left, right) => {
  return left.filter((ele) => {
    return !right.includes(ele);
  });
};

const editStaffExpertise = async (staffId, expertiseIds) => {
  try {
    const currentStaffExpertises = await models.staff_expertise.findAll({
      attributes: ['id_expertise'],
      where: {
        id_staff: staffId,
      },
    });

    const currentStaffExpertiseExpertiseIds = currentStaffExpertises?.map((staffExpertise) => {
      return staffExpertise.id_expertise;
    });

    // Find id have staffExpertiseIds now but not have in expertiseIds
    const removeStaffExpertiseIds = await findDifference(currentStaffExpertiseExpertiseIds, expertiseIds);

    // Find id do not have in staffExpertiseIds now but have in expertiseIds
    const newStaffExpertiseIds = await findDifference(expertiseIds, currentStaffExpertiseExpertiseIds);

    // Create StaffExpertises from staffId and newStaffExpertiseIds
    const newStaffExpertises = newStaffExpertiseIds.map((expertiseId) => {
      return {
        id_staff: staffId,
        id_expertise: expertiseId,
      };
    });

    // console.log("expertiseIds: ", expertiseIds);
    // console.log("currentStaffExpertiseExpertiseIds: ", currentStaffExpertiseExpertiseIds);
    // console.log("removeStaffExpertiseIds: ", removeStaffExpertiseIds);
    // console.log("newStaffExpertiseIds: ", newStaffExpertiseIds);
    // console.log("newStaffExpertises: ", newStaffExpertises);

    // Delete old expertises that no longer existed in staff_expertise
    await models.staff_expertise.destroy({
      where: {
        id_staff: staffId,
        id_expertise: removeStaffExpertiseIds,
      },
    });

    // Add new expertises to staff_expertise
    const res = await models.staff_expertise.bulkCreate(newStaffExpertises);
    return res;
  } catch (error) {
    console.error(error);
  }
};

const getStaffInfo = async (options) => {
  const user = await models.staff.findOne(options);
  if (!user) {
    throw new ApiError(httpStatus.OK, i18next.t('account.notFound'));
  }
  return user;
};

module.exports = {
  createStaff,
  findOneByFilter,
  findOneByOption,
  findAllByFilter,
  findAndCountAllByCondition,
  getRole,
  blockingAccount,
  findDetailStaff,
  unblockingAccount,
  editStaff,
  changePassword,
  findDifference,
  editStaffExpertise,
  getStaffInfo,
};
