const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const pick = require('../utils/pick');
const bookingService = require('./booking.service');
const patientService = require('../patient/patient.service');

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
  const type = pick(req.body, ['type']);
  var newBooking;
  const data = pick(req.body, ['id_schedule', 'reason']);
  //data.id_user = req.user.id;
  data.id_user = '04f4b75b-eced-4036-a76c-446b9f1acd5c';
  if (type.type == 1) {
    newBooking = await bookingService.create(data);
    data.id_booking = newBooking.id;
  } else {
    const patient = pick(req.body, ['name', 'phone_number', 'gender', 'dob', 'health_insurance']);
    //patient.id_user = req.user.id;
    patient.id_user = '04f4b75b-eced-4036-a76c-446b9f1acd5c';
    const newPatient = await patientService.createPatient(patient);
    data.id_patient = newPatient.id;
    newBooking = await bookingService.create(data);
    data.id_booking = newBooking.id;
  }

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
