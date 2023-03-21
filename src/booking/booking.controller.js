const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const pick = require('../utils/pick');
const bookingService = require('./booking.service');

const listBookings = catchAsync(async (req, res) => {
  const listBooking = await bookingService.findAllByFilter();
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
  const data = pick(req.body, ['id_schedule', 'reason', 'id_patient']);
  data.id_user = req.user.id;
  const newBooking = await bookingService.create(data);
  return res.status(httpStatus.OK).json(responseData(newBooking, 'Successful'));
});

const historyBooking = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['booking_status', 'is_payment', 'id_patient']);
  filter.id_user = req.user.id;
  const historyBooking = await bookingService.findAllByFilter(filter);
  return res.status(httpStatus.OK).json(responseData(historyBooking, 'Successful'));
});

const updateBookingStatus = catchAsync(async (req, res) => {
  const data = pick(req.body, ['id', 'booking_status']);
  const updateBooking = await bookingService.updateStatus(data);
  return res.status(httpStatus.OK).json(responseData(updateBooking, 'Successful'));
});

module.exports = {
  booking,
  historyBooking,
  updateBookingStatus,
  listBookings,
  getDetailBooking,
};
