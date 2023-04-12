const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData } = require('../utils/responseFormat');
const expertiseService = require('./expertise.service');
const i18next = require('i18next');

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
  return res.status(httpStatus.OK).json(responseData(expertise, i18next.t('expertise.create')));
});

const updateExpertise = catchAsync(async (req, res) => {
  const expertise = await expertiseService.updateExpertise(req.body);
  return res.status(httpStatus.OK).json(responseData(expertise, i18next.t('expertise.update')));
});

const deleteExpertise = catchAsync(async (req, res) => {
  const expertise = await expertiseService.deleteExpertise(req.body);
  return res.status(httpStatus.OK).json(responseData(expertise, i18next.t('expertise.delete')));
});

module.exports = {
  listExpertise,
  getAll,
  createExpertise,
  updateExpertise,
  deleteExpertise,
};
