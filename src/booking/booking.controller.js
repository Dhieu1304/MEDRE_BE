const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData } = require('../utils/responseFormat');
const pick = require('../utils/pick');
const bookingService = require('./booking.service');

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

module.exports = {
  booking,
  historyBooking,
};
