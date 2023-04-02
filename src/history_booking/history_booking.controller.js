const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const pick = require('../utils/pick');
const historyBookingService = require('./history_booking.service');

const listHistoryBookings = catchAsync(async (req, res) => {
  const listBooking = await historyBookingService.findAllByFilter();
  return res.status(httpStatus.OK).json(responseData(listBooking, 'Successful'));
});

const getDetailBooking = catchAsync(async (req, res) => {
  const booking = await historyBookingService.findOneByFilter({ id: req.params.id });
  if (!booking) {
    return res.status(httpStatus.OK).json(responseMessage('Not found', false));
  }
  return res.status(httpStatus.OK).json(responseData(booking, 'Successful'));
});

const historyBooking = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['booking_status', 'is_payment', 'id_patient']);
  filter.id_user = req.user.id;
  const historyBooking = await historyBookingService.findAllByFilter(filter);
  return res.status(httpStatus.OK).json(responseData(historyBooking, 'Successful'));
});

const updateBookingStatus = catchAsync(async (req, res) => {
  const data = pick(req.body, ['id', 'booking_status']);
  const updateBooking = await historyBookingService.updateStatus(data);
  return res.status(httpStatus.OK).json(responseData(updateBooking, 'Successful'));
});

module.exports = {
  historyBooking,
  updateBookingStatus,
  listHistoryBookings,
  getDetailBooking,
};
