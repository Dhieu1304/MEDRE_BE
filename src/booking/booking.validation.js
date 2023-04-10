const Joi = require('joi');
const { BOOKING_STATUS } = require('./booking.constant');
const { SCHEDULE_TYPE } = require('../schedule/schedule.constant');

const list = {
  query: Joi.object().keys({
    type: Joi.string().valid(...Object.values(SCHEDULE_TYPE)),
    booking_status: Joi.string().valid(...Object.values(BOOKING_STATUS)),
    from: Joi.date(),
    to: Joi.date(),
  }),
};

const booking = {
  body: Joi.object().keys({
    id_schedule: Joi.string().uuid().required(),
    date: Joi.date().required(),
    reason: Joi.string().required(),
    id_patient: Joi.string().uuid(),
  }),
};

const updateBookingStatus = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    booking_status: Joi.string().valid(...Object.values(BOOKING_STATUS)),
  }),
};

const cancelBooking = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    note: Joi.string(),
  }),
};

module.exports = {
  list,
  booking,
  updateBookingStatus,
  cancelBooking,
};
