const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage, paginationFormat } = require('../utils/responseFormat');
const pick = require('../utils/pick');
const bookingService = require('./booking.service');
const { Op } = require('sequelize');
const pageLimit2Offset = require('../utils/pageLimit2Offset');
const models = require('../models');

const listBookings = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  let filter = pick(req.query, ['type', 'booking_status', 'from', 'to', 'is_payment']);
  // add user id
  filter.id_user = req.user.id;

  // convert filter from to
  if (filter.from && filter.to) {
    filter = Object.assign(filter, {
      [Op.and]: [[{ date: { [Op.gte]: filter.from } }, { date: { [Op.lte]: filter.to } }]],
    });
    delete filter.from;
    delete filter.to;
  } else {
    if (filter.from) {
      filter.date = { [Op.gte]: filter.from };
      delete filter.from;
    }
    if (filter.to) {
      filter.date = { [Op.lte]: filter.to };
      delete filter.to;
    }
  }

  const include = [];
  // convert filter type
  if (filter.type) {
    include.push({ model: models.schedule, as: 'booking_schedule', where: { type: filter.type } });
    delete filter.type;
  }
  const condition = {
    where: filter,
    include,
    ...pageLimit2Offset(page, limit),
    order: ['createdAt'],
  };
  const listBooking = await bookingService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(listBooking, page, limit)));
});

const listBookingsForStaff = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  let filter = pick(req.query, [
    'type',
    'booking_status',
    'from',
    'to',
    'is_payment',
    'id_user',
    'id_patient',
    'id_staff_booking',
    'id_staff_cancel',
  ]);

  // convert filter from to
  if (filter.from && filter.to) {
    filter = Object.assign(filter, {
      [Op.and]: [[{ date: { [Op.gte]: filter.from } }, { date: { [Op.lte]: filter.to } }]],
    });
    delete filter.from;
    delete filter.to;
  } else {
    if (filter.from) {
      filter.date = { [Op.gte]: filter.from };
      delete filter.from;
    }
    if (filter.to) {
      filter.date = { [Op.lte]: filter.to };
      delete filter.to;
    }
  }

  const include = [];
  // convert filter type
  if (filter.type) {
    include.push({ model: models.schedule, as: 'booking_schedule', where: { type: filter.type } });
    delete filter.type;
  }
  const condition = {
    where: filter,
    include,
    ...pageLimit2Offset(page, limit),
    order: ['createdAt'],
  };
  const listBooking = await bookingService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(listBooking, page, limit)));
});

const getDetailBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.findOneByFilter({ id: req.params.id });
  if (!booking || booking.id_user !== req.user.id) {
    return res.status(httpStatus.OK).json(responseMessage('Invalid booking', false));
  }
  return res.status(httpStatus.OK).json(responseData(booking));
});

const getDetailBookingForStaff = catchAsync(async (req, res) => {
  const booking = await bookingService.findOneByFilter({ id: req.params.id });
  if (!booking) {
    return res.status(httpStatus.OK).json(responseMessage('Invalid booking', false));
  }
  return res.status(httpStatus.OK).json(responseData(booking));
});

const booking = catchAsync(async (req, res) => {
  const data = req.body;
  data.id_user = req.user.id;
  const newBooking = await bookingService.createNewBooking(data);
  return res.status(httpStatus.OK).json(responseData(newBooking, 'Successful.'));
});

const updateBooking = catchAsync(async (req, res) => {
  const data = pick(req.body, ['id', 'booking_status', 'type', 'is_payment']);
  const updateBooking = await bookingService.updateBooking(data);
  return res.status(httpStatus.OK).json(responseData(updateBooking, 'Update Successfully'));
});

const cancelBooking = catchAsync(async (req, res) => {
  await bookingService.cancelBooking(req.user.id, req.body.id);
  return res.status(httpStatus.OK).json(responseMessage('Cancel booking successfully', true));
});

module.exports = {
  booking,
  updateBooking,
  listBookings,
  listBookingsForStaff,
  getDetailBooking,
  getDetailBookingForStaff,
  cancelBooking,
};
