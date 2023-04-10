const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const pick = require('../utils/pick');
const bookingService = require('./booking.service');
const { Op } = require('sequelize');

const listBookings = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['type', 'booking_status', 'from', 'to']);
  filter.id_user = req.user.id;
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
  const listBooking = await bookingService.findAllByFilter(filter);
  return res.status(httpStatus.OK).json(responseData(listBooking, 'Successful'));
});

const getDetailBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.findOneByFilter({ id: req.params.id });
  if (!booking) {
    return res.status(httpStatus.OK).json(responseMessage('Not found', false));
  }
  return res.status(httpStatus.OK).json(responseData(booking, 'Successful'));
});

const booking = catchAsync(async (req, res) => {
  const data = req.body;
  data.id_user = req.user.id;
  const newBooking = await bookingService.createNewBooking(data);
  return res.status(httpStatus.OK).json(responseData(newBooking, 'Successful.'));
});

const updateBookingStatus = catchAsync(async (req, res) => {
  const data = pick(req.body, ['id', 'booking_status']);
  const updateBooking = await bookingService.updateStatus(data);
  return res.status(httpStatus.OK).json(responseData(updateBooking, 'Successful.'));
});

const cancelBooking = catchAsync(async (req, res) => {
  const data = pick(req.body, ['id', 'note']);
  await bookingService.cancelBooking(data);
  return res.status(httpStatus.OK).json(responseData({}, 'Cancel booking successful.'));
});

module.exports = {
  booking,
  updateBookingStatus,
  listBookings,
  getDetailBooking,
  cancelBooking,
};
