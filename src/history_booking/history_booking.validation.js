const Joi = require('joi');
const { HISTORY_BOOKING_STATUS } = require('./history_booking.constant');

const historyBooking = {
  query: Joi.object().keys({
    booking_status: Joi.string().valid(...Object.values(HISTORY_BOOKING_STATUS)),
    is_payment: Joi.boolean(),
    id_patient: Joi.string().uuid(),
  }),
};

module.exports = {
  historyBooking,
};
