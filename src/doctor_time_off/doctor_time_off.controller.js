const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData } = require('../utils/responseFormat');
const doctorTimeOffService = require('./doctor_time_off.service');
const { Op } = require('sequelize');

const getDoctorTimeOff = catchAsync(async (req, res) => {
  const { id_doctor, from, to } = req.query;
  const filter = {
    id_doctor,
    [Op.and]: [{ date: { [Op.gte]: from } }, { date: { [Op.lte]: to } }],
  };
  const doctorTimeOff = await doctorTimeOffService.findAllByFilter(filter);
  return res.status(httpStatus.OK).json(responseData(doctorTimeOff));
});

module.exports = {
  getDoctorTimeOff,
};
