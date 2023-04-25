const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage, paginationFormat } = require('../utils/responseFormat');
const doctorTimeOffService = require('./doctor_time_off.service');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const pageLimit2Offset = require('../utils/pageLimit2Offset');
const moment = require('moment');

const getDoctorTimeOff = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const { id_doctor, from, to } = req.query;
  const filter = {
    [Op.not]: { [Op.or]: [{ from: { [Op.gt]: to } }, { to: { [Op.lt]: from } }] },
  };
  if (id_doctor) {
    filter.id_doctor = id_doctor;
  }
  const condition = {
    where: filter,
    ...pageLimit2Offset(page, limit),
  };
  const doctorTimeOff = await doctorTimeOffService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(doctorTimeOff, page, limit)));
});

const createTimeOff = catchAsync(async (req, res) => {
  const data = req.body;
  if (data.time_start >= data.time_end) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('Invalid time', false));
  }
  if (data.from > data.to || data.from < moment()) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('Invalid date', false));
  }
  data.id = uuidv4();
  data.id_doctor = req.user.id;
  const timeOff = await doctorTimeOffService.createTimeOff(data);
  return res.status(httpStatus.OK).json(responseData(timeOff, 'Create time off successfully'));
});

module.exports = {
  getDoctorTimeOff,
  createTimeOff,
};
