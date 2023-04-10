const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const models = require('../models');
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');
const userService = require('../user/user.service');
const patientService = require('../patient/patient.service');
const { v4: uuidv4 } = require('uuid');
const { USER_STATUS } = require('../user/user.constant');
const { STAFF_ROLES } = require('./staff.constant');

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
    return await models.staff.findAndCountAll(condition);
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
  if (account.status !== USER_STATUS.OK) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The account has already blocked or deleted.');
  }

  // generate uuid
  const id = uuidv4();

  // Nurse can block User
  if (staffRole === STAFF_ROLES.NURSE) {
    if (blockingAccountRole != 'User') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You do not have this permission.');
    }
  }

  // Doctor can block Nurse, User
  else if (staffRole === STAFF_ROLES.DOCTOR) {
    if (blockingAccountRole !== STAFF_ROLES.NURSE && blockingAccountRole != 'User') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You do not have this permission.');
    }
  }

  // Block the account and write into block_account table
  account.status = USER_STATUS.BLOCK;
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
  if (account.status === USER_STATUS.OK) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Don't need to unblock the account.");
  }

  // generate uuid
  const id = uuidv4();

  //Unblock the account and write into block_account table
  account.status = USER_STATUS.OK;
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
  if (data.expertise) {
    await editStaffExpertise(id, data.expertise);
  }
};

const changePassword = async (id, data) => {
  const staff = await findOneByFilter({id:id});

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
  await staff.update({ password: newPassword});
  return staff;
};

// Find elements have in array left but not have in array right
const findDifference = async (left, right) => {
  return left.filter(ele => !right.includes(ele));
}

const editStaffExpertise = async (staffId, expertiseIds) => {
  try {
    const currentStaffExpertises = await models.staff_expertise.findAll({
      attributes: ['id_expertise'],
      where: {
        id_staff: staffId,
      }
    })

    const currentStaffExpertiseExpertiseIds= currentStaffExpertises?.map((staffExpertise) =>
      staffExpertise.id_expertise
    );

    // Find id have staffExpertiseIds now but not have in expertiseIds 
    const removeStaffExpertiseIds = await findDifference(currentStaffExpertiseExpertiseIds, expertiseIds);

    // Find id do not have in staffExpertiseIds now but have in expertiseIds
    const newStaffExpertiseIds = await findDifference(expertiseIds, currentStaffExpertiseExpertiseIds);

    // Create StaffExpertises from staffId and newStaffExpertiseIds
    const newStaffExpertises = newStaffExpertiseIds.map((expertiseId) => ({
      id_staff: staffId,
      id_expertise: expertiseId
    }))

    // console.log("expertiseIds: ", expertiseIds);
    // console.log("currentStaffExpertiseExpertiseIds: ", currentStaffExpertiseExpertiseIds);
    // console.log("removeStaffExpertiseIds: ", removeStaffExpertiseIds);
    // console.log("newStaffExpertiseIds: ", newStaffExpertiseIds);
    // console.log("newStaffExpertises: ", newStaffExpertises);


    // Delete old expertises that no longer existed in staff_expertise 
    const res1 = await models.staff_expertise.destroy({
      where: {
        id_staff: staffId,
        id_expertise: removeStaffExpertiseIds
      }
    })

    // Add new expertises to staff_expertise 
    const res2 = await models.staff_expertise.bulkCreate(newStaffExpertises)
    return res2;
  } catch (error) {
    console.error(error);
  }
}

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
  changePassword,
  findDifference,
  editStaffExpertise,
};
