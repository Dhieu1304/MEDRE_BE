const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData } = require('../utils/responseFormat');
const doctorTimeOffService = require('./doctor_time_off.service');

const getDoctorTimeOff = catchAsync(async (req, res) => {
  const doctorTimeOff = await doctorTimeOffService.findAllByFilter({ order: ['time_start'] });
  return res.status(httpStatus.OK).json(responseData(doctorTimeOff, 'Successful'));
});

module.exports = {
  getDoctorTimeOff,
};
