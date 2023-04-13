const models = require('../models');
const { v4: uuidv4 } = require('uuid');
const scheduleService = require('../schedule/schedule.service');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { SCHEDULE_STATUS } = require('../schedule/schedule.constant');
const { Op } = require('sequelize');
const { BOOKING_STATUS } = require('./booking.constant');
const i18next = require('i18next');

const create = async (data) => {
  // check schedule
  const schedule = await scheduleService.findOneByFilter({ id: data.id_schedule });
  if (!schedule || schedule.status !== SCHEDULE_STATUS.EMPTY) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidID'));
  }

  data.id = uuidv4();

  // update status schedule
  schedule.status = SCHEDULE_STATUS.WAITING;
  await schedule.save();

  return models.booking.create(data);
};

const createNewBooking = async (data) => {
  // check booking
  if (data.id_patient) {
    if (!(await models.patient.findOne({ where: { id: data.id_patient } }))) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('patient.notFound'));
    }
  }

  // check is any booking at this time
  const booking = await models.booking.findOne({
    where: {
      date: data.date,
      id_schedule: data.id_schedule,
      booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
    },
  });
  if (booking) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidID'));
  }

  data.id = uuidv4();
  return models.booking.create(data);
};

const findOneByFilter = async (filter) => {
  return await models.booking.findOne({ where: filter });
};

const findOneByOption = async (option) => {
  return await models.booking.findOne(option);
};

const findAllByFilter = async (filter) => {
  return await models.booking.findAll({ where: filter });
};

const findAndCountAllByCondition = async (condition) => {
  return await models.booking.findAndCountAll(condition);
};

const updateBooking = async (data) => {
  let booking = await findOneByFilter({ id: data.id });
  if (!booking) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidID'));
  }

  booking = Object.assign(booking, data);
  return await booking.save();
};

const cancelBooking = async (id_user, id) => {
  const booking = await findOneByFilter({ id, id_user });
  if (!booking) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidID'));
  }

  // check time
  if (booking.date < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This is old booking');
  }

  booking.booking_status = BOOKING_STATUS.CANCELED;
  booking.canceledAt = new Date();
  return await booking.save();
};

module.exports = {
  create,
  findOneByFilter,
  findOneByOption,
  findAllByFilter,
  updateBooking,
  cancelBooking,
  createNewBooking,
  findAndCountAllByCondition,
};
