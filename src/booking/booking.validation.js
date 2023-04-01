const Joi = require('joi');
const { BOOKING_STATUS } = require('./booking.constant');
const { GENDERS } = require('../user/user.constant');

const booking = {
  body: Joi.object().keys({
    type: Joi.number().required(),  //Type: 1 - Self, 2 - Other
    id_schedule: Joi.string().uuid().required(),
    reason: Joi.string().required(),
    id_patient: Joi.string().uuid(),
    name: Joi.string(),
    phone_number: Joi.string(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    dob: Joi.date(),
    health_insurance: Joi.string(),
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

const cancelBooking = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    note: Joi.string(),
  }),
};

module.exports = {
  booking,
  historyBooking,
  updateBookingStatus,
  cancelBooking,
};
