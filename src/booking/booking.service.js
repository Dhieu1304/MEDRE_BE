const models = require('../models');
const { v4: uuidv4 } = require('uuid');
const scheduleService = require('../schedule/schedule.service');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const userService = require('../user/user.service');
const { SCHEDULE_STATUS } = require('../schedule/schedule.constant');

const create = async (data) => {
  // check schedule
  const schedule = await scheduleService.findOneByFilter({ id: data.id_schedule });
  if (!schedule || schedule.status !== SCHEDULE_STATUS.EMPTY) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid schedule id');
  }

  // check patient
  if (!(await userService.findOneByFilter({ id: data.id_patient }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid patient id');
  }

  data.id = uuidv4();

  // update status schedule
  schedule.status = SCHEDULE_STATUS.WAITING;
  await schedule.save();

  return models.booking.create(data);
};

const findOneByFilter = async (filter) => {
  return await models.booking.findOne({ where: filter });
};

const findAllByFilter = async (filter) => {
  return await models.booking.findAll({ where: filter });
};

module.exports = {
  create,
  findOneByFilter,
  findAllByFilter,
};
