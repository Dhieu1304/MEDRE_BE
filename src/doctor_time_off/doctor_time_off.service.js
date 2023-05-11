const models = require('../models');
const { Op } = require('sequelize');
const { BOOKING_STATUS } = require('../booking/booking.constant');
const ApiError = require('../utils/ApiError');
const { BAD_REQUEST } = require('http-status');
const i18next = require('i18next');
const { SCHEDULE_SESSION } = require('../schedule/schedule.constant');

const findAllByFilter = async (filter) => {
  return await models.doctor_time_off.findAll(filter);
};

const findAndCountAllByCondition = async (condition) => {
  return await models.doctor_time_off.findAndCountAll(condition);
};

// data: {id, id_doctor, from, to, time_start, time_end}
const createTimeOff = async (data) => {
  // check is have time off at this time
  const existTimeOff = await models.doctor_time_off.findOne({
    where: {
      id_doctor: data.id_doctor,
      [Op.not]: { [Op.or]: [{ from: { [Op.gt]: data.to } }, { to: { [Op.lt]: data.from } }] },
    },
  });
  if (existTimeOff) {
    throw new ApiError(BAD_REQUEST, i18next.t('timeSchedule.haveTimeOff'));
  }

  // check time is have any booking
  const filterTimeSchedule = {};
  if (data.session !== SCHEDULE_SESSION.WHOLE_DAY) {
    filterTimeSchedule.session = data.session;
  }
  const booking = await models.booking.findAll({
    where: {
      date: { [Op.between]: [data.from, data.to] },
      booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
    },
    include: [
      {
        model: models.time_schedule,
        as: 'booking_time_schedule',
        where: filterTimeSchedule,
      },
      {
        model: models.schedule,
        as: 'booking_schedule',
        where: { id_doctor: data.id_doctor },
      },
    ],
  });
  if (booking && booking.length > 0) {
    throw new ApiError(BAD_REQUEST, i18next.t('timeSchedule.haveBooking'));
  }

  // check is have schedule at this time --> no need, only replace above schedule

  return await models.doctor_time_off.create(data);
};

module.exports = {
  findAllByFilter,
  createTimeOff,
  findAndCountAllByCondition,
};
