const Joi = require('joi');
const { BOOKING_STATUS } = require('./history_booking.constant');

const booking = {
  body: Joi.object().keys({
    id_schedule: Joi.string().uuid().required(),
    reason: Joi.string().required(),
    id_patient: Joi.string().uuid().required(),
  }),
};

const historyBooking = {
  query: Joi.object().keys({
    booking_status: Joi.string().valid(...Object.values(BOOKING_STATUS)),
    is_payment: Joi.boolean(),
    id_patient: Joi.string().uuid(),
  }),
};

const updateBookingStatus = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    booking_status: Joi.string().valid(...Object.values(BOOKING_STATUS)),
  }),
};

module.exports = {
  booking,
  historyBooking,
  updateBookingStatus,
};
