const models = require('../models');
const { Op } = require('sequelize');
const { BOOKING_STATUS } = require('../booking/booking.constant');
const ApiError = require('../utils/ApiError');
const { BAD_REQUEST } = require('http-status');
const i18next = require('i18next');

const findAllByFilter = async (filter) => {
  return await models.doctor_time_off.findAll(filter);
};

const findAndCountAllByCondition = async (condition) => {
  return await models.doctor_time_off.findAndCountAll(condition);
};

// data: {id, id_doctor, from, to, time_start, time_end}
const createTimeOff = async (data) => {
  // check time is have any booking
  const booking = await models.booking.findAll({
    where: {
      date: { [Op.between]: [data.from, data.to] },
      booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
    },
    include: [
      {
        model: models.time_schedule,
        as: 'booking_time_schedule',
        where: {
          [Op.and]: [{ time_end: { [Op.gte]: data.time_start } }, { time_start: { [Op.lte]: data.time_end } }],
        },
      },
      {
        model: models.schedule,
        as: 'booking_schedule',
        include: { model: models.staff, as: 'schedule_of_staff', where: { id: data.id_doctor } },
      },
    ],
  });
  if (booking && booking.length > 0) {
    throw new ApiError(BAD_REQUEST, i18next.t('timeSchedule.haveBooking'));
  }

  // check is have schedule at this time --> no need, only replace above schedule

  // check is have time off at this time --> no need, only loop this time

  return await models.doctor_time_off.create(data);
};

module.exports = {
  findAllByFilter,
  createTimeOff,
  findAndCountAllByCondition,
};
