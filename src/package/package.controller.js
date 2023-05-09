const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseMessage, responseData } = require('../utils/responseFormat');
const i18next = require('i18next');
const scheduleService = require('../schedule/schedule.service');
const packageService = require('./package.service');

const getPrice = catchAsync(async (req, res) => {
  const id_schedule = req.query;
  const schedule = scheduleService.findOneByFilter({ id: id_schedule });
  const price = packageService.findOneByFilter({ id_expertise: schedule.id_expertise });
  return res.status(httpStatus.OK).json(responseData(price.price));
});

const updatePrice = catchAsync(async (req, res) => {
  const { id_package, price } = req.query;
  await packageService.updatePrice(id_package, price);
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('package.success')));
});

const getAllPackage = catchAsync(async (req, res) => {
  const id_expertise = req.query;
  const packages = packageService.findAllByFilter({ id_expertise: id_expertise });
  return res.status(httpStatus.OK).json(responseData(packages));
});

const createPackage = catchAsync(async (req, res) => {
  const package = await packageService.createPackage(req.body);
  return res.status(httpStatus.OK).json(responseData(package));
});

const deletePackage = catchAsync(async (req, res) => {
  await packageService.deletePackage(req.query);
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('package.delete')));
});

module.exports = {
  getPrice,
  updatePrice,
  createPackage,
  getAllPackage,
  deletePackage,
};
