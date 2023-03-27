const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData } = require('../utils/responseFormat');
const expertiseService = require('./expertise.service');

const listExpertise = catchAsync(async (req, res) => {
  const expertises = await expertiseService.findAllByFilter();
  return res.status(httpStatus.CREATED).json(responseData(expertises));
});

const getAll = catchAsync(async (req, res) => {
  const expertises = await expertiseService.findAllByFilter();
  console.log(expertises);
  return res.status(httpStatus.OK).json(responseData(expertises));
});

const createExpertise = catchAsync(async (req, res) => {
  const expertise = await expertiseService.createExpertise(req.body);
  return res.status(httpStatus.OK).json(responseData(expertise, 'Create new expertise successfully.'));
});

const updateExpertise = catchAsync(async (req, res) => {
  const expertise = await expertiseService.updateExpertise(req.body);
  return res.status(httpStatus.OK).json(responseData(expertise, 'Update expertise successfully.'));
});

const deleteExpertise = catchAsync(async (req, res) => {
  const expertise = await expertiseService.deleteExpertise(req.body);
  return res.status(httpStatus.OK).json(responseData(expertise, 'Delete expertise successfully.'));
});

module.exports = {
  listExpertise,
  getAll,
  createExpertise,
  updateExpertise,
  deleteExpertise,
};
