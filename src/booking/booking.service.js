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
const sequelize = require('../config/database');

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
  const listBooking = await models.booking.findAll({
    where: {
      date: data.date,
      id_schedule: data.id_schedule,
      id_time: data.id_time,
      booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
    },
  });

  for (let i = 0; i < listBooking.length; i++) {
    if (listBooking[i].id_user === data.id_user) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.booked'));
    }
  }

  const scheduleBookingTime = await scheduleBooingTimeService.findOneByScheduleAndTime(data.id_schedule, data.id_time);
  if (!scheduleBookingTime) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something wrong, please contact support!!');
  }

  let totalBooking = scheduleBookingTime.tt_off_book_onl;
  if (schedule.type === SCHEDULE_TYPE.ONLINE) {
    totalBooking = scheduleBookingTime.total_online;
  }
  if (listBooking.length >= totalBooking) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.fullSlot'));
  }

  data.id = uuidv4();
  return models.booking.create(data);
};

// staff only booking redirect
const createNewBookingForStaff = async (data) => {
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
  const listBooking = await models.booking.findAll({
    where: {
      date: data.date,
      id_schedule: data.id_schedule,
      id_time: data.id_time,
      booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
      id_staff_booking: { [Op.ne]: null },
    },
  });

  for (let i = 0; i < listBooking.length; i++) {
    if (listBooking[i].id_user === data.id_user) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.booked'));
    }
  }

  const scheduleBookingTime = await scheduleBooingTimeService.findOneByScheduleAndTime(data.id_schedule, data.id_time);
  if (!scheduleBookingTime) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something wrong, please contact support!!');
  }

  const totalBooking = scheduleBookingTime.total_offline - scheduleBookingTime.tt_off_book_onl;
  if (listBooking.length >= totalBooking) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.fullSlot'));
  }

  const startNum = scheduleBookingTime.start_num_off + 1; // redirect
  const jump = 2;
  data.ordinal_number = scheduleBooingTimeService.getOrdinalNumberFromListBooking(listBooking, +startNum, +jump);
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

const countScheduleBookingTime = async (id_expertise, id_doctor, filter) => {
  return await models.booking.findAll({
    where: filter,
    include: [
      {
        model: models.schedule,
        as: 'booking_schedule',
        where: { id_expertise, id_doctor },
        attributes: ['id', 'id_expertise', 'type'],
      },
      {
        model: models.time_schedule,
        as: 'booking_time_schedule',
        attributes: ['id', 'time_start', 'time_end'],
      },
    ],
    attributes: [
      'date',
      'booking_time_schedule.time_start',
      'booking_schedule.id_expertise',
      [sequelize.fn('count', sequelize.col('booking.id')), 'countBooking'],
      [sequelize.literal('booking.date'), 'temp_date'],
      [
        sequelize.literal(
          `(SELECT total_offline FROM schedule_booking_time WHERE ` +
            'id_expertise = booking_schedule.id_expertise AND id_time_schedule = booking_time_schedule.id)'
        ),
        'totalBookingOffline',
      ],
      [
        sequelize.literal(
          `(SELECT total_online FROM schedule_booking_time WHERE ` +
            'id_expertise = booking_schedule.id_expertise AND id_time_schedule = booking_time_schedule.id)'
        ),
        'totalBookingOnline',
      ],
      [
        sequelize.literal(
          `(SELECT tt_off_book_onl FROM schedule_booking_time WHERE ` +
            'id_expertise = booking_schedule.id_expertise AND id_time_schedule = booking_time_schedule.id)'
        ),
        'totalOffBookOnl',
      ],
    ],
    group: ['booking.date', 'booking_time_schedule.id', 'booking_schedule.id'],
    order: [
      ['date', 'asc'],
      [{ model: models.time_schedule, as: 'booking_time_schedule' }, 'time_start', 'asc'],
    ],
  });
};

module.exports = {
  findOneByFilter,
  findOneByOption,
  findAllByFilter,
  updateBooking,
  cancelBooking,
  createNewBooking,
  createNewBookingForStaff,
  findAndCountAllByCondition,
  updateBookingDoctor,
  countScheduleBookingTime,
};
