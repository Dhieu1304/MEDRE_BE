const Joi = require('joi');
const { BOOKING_STATUS } = require('./booking.constant');
const { SCHEDULE_TYPE } = require('../schedule/schedule.constant');
const { phoneNumberFormat } = require('../utils/messageCustom');

const list = {
  query: Joi.object().keys({
    type: Joi.string().valid(...Object.values(SCHEDULE_TYPE)),
    booking_status: Joi.array().items(Joi.string().valid(...Object.values(BOOKING_STATUS))),
    is_payment: Joi.boolean(),
    from: Joi.date(),
    to: Joi.date(),
    order: Joi.string()
      .valid('createdAt:asc', 'createdAt:desc', 'updatedAt:asc', 'updatedAt:desc', 'date:asc', 'date:desc')
      .default('createdAt:desc'),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

const listForStaff = {
  query: Joi.object().keys({
    id_user: Joi.string().uuid(),
    id_patient: Joi.string().uuid(),
    id_doctor: Joi.string().uuid(),
    id_staff_booking: Joi.string().uuid(),
    id_staff_update: Joi.string().uuid(),
    type: Joi.string().valid(...Object.values(SCHEDULE_TYPE)),
    booking_status: Joi.array().items(Joi.string().valid(...Object.values(BOOKING_STATUS))),
    is_payment: Joi.boolean(),
    from: Joi.date(),
    to: Joi.date(),
    patient_phone_number: Joi.string().custom(phoneNumberFormat).trim(),
    order: Joi.string()
      .valid('createdAt:asc', 'createdAt:desc', 'updatedAt:asc', 'updatedAt:desc', 'date:asc', 'date:desc')
      .default('createdAt:desc'),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

const booking = {
  body: Joi.object().keys({
    id_schedule: Joi.string().uuid().required(),
    id_time: Joi.string().uuid().required(),
    date: Joi.date().required(),
    reason: Joi.string(),
    id_patient: Joi.string().uuid(),
  }),
};

const updateBooking = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    booking_status: Joi.string().valid(...Object.values(BOOKING_STATUS)),
    is_payment: Joi.boolean(),
    id_schedule: Joi.string().uuid(),
    id_patient: Joi.string().uuid(),
    date: Joi.date(),
    id_time: Joi.string().uuid(),
    code: Joi.string().trim(),
    reason: Joi.string().trim(),
  }),
};

const updateBookingDoctor = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    note: Joi.string().trim(),
    conclusion: Joi.string().trim(),
    prescription: Joi.string().trim(),
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

const bookingForStaff = {
  body: Joi.object().keys({
    id_schedule: Joi.string().uuid().required(),
    id_time: Joi.string().uuid().required(),
    date: Joi.date().required(),
    reason: Joi.string(),
    id_user: Joi.string().uuid(),
    id_patient: Joi.string().uuid(),
  }),
};

const scheduleBookingTime = {
  query: Joi.object().keys({
    id_expertise: Joi.array().items(Joi.string().uuid().required()).required(),
    id_doctor: Joi.string().uuid().required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
    bookingMethod: Joi.string().valid('remote', 'redirect').default('remote'),
  }),
};

module.exports = {
  list,
  listForStaff,
  booking,
  updateBooking,
  cancelBooking,
  detailBooking,
  updateBookingDoctor,
  bookingForStaff,
  scheduleBookingTime,
};
