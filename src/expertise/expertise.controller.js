const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const expertiseService = require('./expertise.service');
const i18next = require('i18next');
const pick = require('../utils/pick');

const listExpertise = catchAsync(async (req, res) => {
  const expertises = await expertiseService.findAllByFilter();
  return res.status(httpStatus.CREATED).json(responseData(expertises));
});

const getAll = catchAsync(async (req, res) => {
  const expertises = await expertiseService.findAllByFilter();
  return res.status(httpStatus.OK).json(responseData(expertises));
});

const createExpertise = catchAsync(async (req, res) => {
  const expertise = await expertiseService.createExpertise(req.body);
  return res.status(httpStatus.OK).json(responseData(expertise, i18next.t('expertise.create')));
});

const updateExpertise = catchAsync(async (req, res) => {
  const updateObject = pick(req.body, ['id', 'name', 'price_offline', 'price_online']);
  const expertise = await expertiseService.updateExpertise(updateObject);
  return res.status(httpStatus.OK).json(responseData(expertise, i18next.t('expertise.update')));
});

const deleteExpertise = catchAsync(async (req, res) => {
  await expertiseService.deleteExpertise(req.body);
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('expertise.delete')));
});

module.exports = {
  listExpertise,
  getAll,
  createExpertise,
  updateExpertise,
  deleteExpertise,
};
