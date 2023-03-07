const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const staffService = require('./staff.service');

const getInfo = catchAsync(async (req, res) => {
  const staff = await staffService.findOneByFilter({ id: req.params.id });
  if (!staff) {
    return res.status(httpStatus.OK).json(responseMessage('Staff not found', false));
  }
  const staffId = staff.id;
  const expertise = await staffService.findExpertise({ staffId });
  return res.status(httpStatus.OK).json(responseData({ staff, expertise }));
});

const getAll = catchAsync(async (req, res) => {
  const staffs = await staffService.findAllByFilter();
  return res.status(httpStatus.OK).json(responseData(staffs));
});

const getAllDoctor = catchAsync(async (req, res) => {
  const drs = await staffService.findAllByFilter({ role: 'Doctor' });
  if (!drs) {
    return res.status(httpStatus.OK).json(responseMessage('Not found', false));
  }
  return res.status(httpStatus.OK).json(responseData(drs));
});

const createStaff = catchAsync(async (req, res) => {
  const staff = await staffService.createStaff(req.body);
  return res.status(httpStatus.OK).json(responseData(staff, 'Create new staff successfully'));
});

module.exports = {
  getInfo,
  getAll,
  getAllDoctor,

  // admin
  createStaff,
};
