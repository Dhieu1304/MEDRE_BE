const Joi = require('joi');
const { BOOKING_STATUS } = require('./booking.constant');
const { SCHEDULE_TYPE } = require('../schedule/schedule.constant');

const list = {
  query: Joi.object().keys({
    type: Joi.string().valid(...Object.values(SCHEDULE_TYPE)),
    booking_status: Joi.string().valid(...Object.values(BOOKING_STATUS)),
    is_payment: Joi.boolean(),
    from: Joi.date(),
    to: Joi.date(),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

const listForStaff = {
  query: Joi.object().keys({
    id_user: Joi.string().uuid(),
    id_patient: Joi.string().uuid(),
    id_staff_booking: Joi.string().uuid(),
    id_staff_cancel: Joi.string().uuid(),
    type: Joi.string().valid(...Object.values(SCHEDULE_TYPE)),
    booking_status: Joi.string().valid(...Object.values(BOOKING_STATUS)),
    is_payment: Joi.boolean(),
    from: Joi.date(),
    to: Joi.date(),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
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

const updateBooking = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    booking_status: Joi.string().valid(...Object.values(BOOKING_STATUS)),
    type: Joi.string().valid(...Object.values(SCHEDULE_TYPE)),
    is_payment: Joi.boolean(),
  }),
};

const cancelBooking = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

const detailBooking = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

module.exports = {
  list,
  listForStaff,
  booking,
  updateBooking,
  cancelBooking,
  detailBooking,
};
