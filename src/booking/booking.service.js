const models = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { BOOKING_STATUS } = require('./booking.constant');
const i18next = require('i18next');
const userService = require('../user/user.service');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const { SCHEDULE_SESSION, SCHEDULE_TYPE } = require('../schedule/schedule.constant');
const scheduleBooingTimeService = require('../schedule_booking_time/schedule_booking_time.service');

const createNewBooking = async (data) => {
  // check user info
  if (data.id_user && !(await userService.checkUserInfo(data.id_user))) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.missingUserInfo'));
  }

  // check patient
  if (!(await models.patient.findOne({ where: { id: data.id_patient } }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('patient.notFound'));
  }

  // check day_of_week of schedule is valid date booking
  const schedule = await models.schedule.findOne({
    where: {
      id: data.id_schedule,
      apply_to: { [Op.gte]: data.date },
      repeat_on: { [Op.substring]: moment(data.date).day() },
    },
  });
  if (!schedule) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidScheduleId'));
  }

  // check time
  const timeSchedule = await models.time_schedule.findOne({ where: { id: data.id_time } });
  if (!timeSchedule) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidTimeID'));
  }

  // check schedule valid time session
  if (schedule.session !== SCHEDULE_SESSION.WHOLE_DAY) {
    if (timeSchedule.session !== schedule.session) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidTimeSession'));
    }
  }

  // check is any booking at this time
  const countBooking = await models.booking.count({
    where: {
      date: data.date,
      id_schedule: data.id_schedule,
      id_time: data.id_time,
      booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
    },
  });
  const scheduleBookingTime = await scheduleBooingTimeService.findOneByScheduleAndTime();
  if (!scheduleBookingTime) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something wrong, please contact support!!');
  }

  let totalBooking = scheduleBookingTime.total_offline_booking_online;
  let ordinal_number = scheduleBookingTime.start_ordinal_number_offline + 2;
  if (schedule.type === SCHEDULE_TYPE.ONLINE) {
    totalBooking = scheduleBookingTime.total_online;
    ordinal_number = scheduleBookingTime.start_ordinal_number_online + 1;
  }
  if (countBooking >= totalBooking) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.fullSlot'));
  }

  data.id = uuidv4();
  data.ordinal_number = ordinal_number;
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

  if (data.id_patient && !(await models.patient.findOne({ where: { id: data.id_patient } }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('patient.notFound'));
  }

  if (data.id_schedule || data.date || data.id_time) {
    const id_schedule = data.id_schedule || booking.id_schedule;
    const date = data.date || booking.date;
    const id_time = data.id_time || booking.id_time;
    // check day_of_week of schedule is valid date booking
    const schedule = await models.schedule.findOne({
      where: {
        id: id_schedule,
        apply_to: { [Op.gte]: date },
        repeat_on: { [Op.substring]: moment(date).day() },
      },
    });
    if (!schedule) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidScheduleId'));
    }

    // check time
    const timeSchedule = await models.time_schedule.findOne({ where: { id: id_time } });
    if (!timeSchedule) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidTimeID'));
    }

    // check schedule valid time session
    if (schedule.session !== SCHEDULE_SESSION.WHOLE_DAY) {
      if (timeSchedule.session !== schedule.session) {
        throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidTimeSession'));
      }
    }

    const booking = await models.booking.findOne({
      where: {
        date: date,
        id_schedule: id_schedule,
        id_time: id_time,
        booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
      },
    });
    if (booking) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidID'));
    }
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

const updateBookingDoctor = async (data) => {
  let booking = await findOneByFilter({ id: data.id });
  if (!booking) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidID'));
  }
  delete data.id;
  Object.keys(data).forEach((key) => {
    if (!booking[key]) {
      booking[key] = data[key];
    }
  });
  return await booking.save();
};

module.exports = {
  findOneByFilter,
  findOneByOption,
  findAllByFilter,
  updateBooking,
  cancelBooking,
  createNewBooking,
  findAndCountAllByCondition,
  updateBookingDoctor,
};
