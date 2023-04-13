const models = require('../models');

const findAllByFilter = async (filter) => {
  return await models.doctor_time_off.findAll(filter);
};

const findAndCountAllByCondition = async (condition) => {
  return await models.doctor_time_off.findAndCountAll(condition);
};

const createTimeOff = async (data) => {
  // todo: check time is have any booking
  /*const booking = await models.booking.findAll({
    where: {
      date: data.date,
      booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
    },
    include: {
      model: models.schedule,
      as: 'booking_schedule',
      include: {
        model: models.time_schedule,
        as: 'time_schedule',
        where: {
          time_start: { [Op.gte]: data.time_start },
          time_end: { [Op.lte]: data.time_end }
        }
      }
    }
  });
  if (booking) {
    console.log(data);
    console.log(booking.length);
    booking.map(item => {
      console.log(item.id);
    })
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('timeSchedule.haveBooking'))
  }*/

  // todo: check is have schedule at this time

  return await models.doctor_time_off.create(data);
};

module.exports = {
  findAllByFilter,
  createTimeOff,
  findAndCountAllByCondition,
};
