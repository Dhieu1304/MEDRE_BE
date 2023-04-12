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

const findAllByFilter = async (filter) => {
  return await models.booking.findAll({ where: filter });
};

const updateStatus = async (data) => {
  const booking = await findOneByFilter({ id: data.id });
  if (!booking) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidID'));
  }
  booking.booking_status = data.booking_status;
  await booking.save();
  return booking;
};

const cancelBooking = async (data) => {
  const booking = await findOneByFilter({ id: data.id });
  if (!booking) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidID'));
  }

  //delete booking
  return await models.booking.destroy({ where: { id: booking.id } });
};

module.exports = {
  create,
  findOneByFilter,
  findAllByFilter,
  updateStatus,
  cancelBooking,
  createNewBooking,
};
