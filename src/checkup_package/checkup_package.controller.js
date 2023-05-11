const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseMessage, responseData } = require('../utils/responseFormat');
const i18next = require('i18next');
const scheduleService = require('../schedule/schedule.service');
const checkupPackageService = require('./checkup_package.service');

const getPrice = catchAsync(async (req, res) => {
  const id_schedule = req.query;
  const schedule = scheduleService.findOneByFilter({ id: id_schedule });
  const price = checkupPackageService.findOneByFilter({ id_expertise: schedule.id_expertise });
  return res.status(httpStatus.OK).json(responseData(price.price));
});

const updatePrice = catchAsync(async (req, res) => {
  const { id_checkup_package, price } = req.query;
  await checkupPackageService.updatePrice(id_checkup_package, price);
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('checkupPackage.success')));
});

const getAllCheckupPackage = catchAsync(async (req, res) => {
  const id_expertise = req.query;
  const checkup_packages = checkupPackageService.findAllByFilter({ id_expertise: id_expertise });
  return res.status(httpStatus.OK).json(responseData(checkup_packages));
});

const createCheckupPackage = catchAsync(async (req, res) => {
  const checkup_package = await checkupPackageService.createPackage(req.body);
  return res.status(httpStatus.OK).json(responseData(checkup_package));
});

const deleteCheckupPackage = catchAsync(async (req, res) => {
  await checkupPackageService.deletePackage(req.query);
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('checkupPackage.delete')));
});

module.exports = {
  getPrice,
  updatePrice,
  createCheckupPackage,
  getAllCheckupPackage,
  deleteCheckupPackage,
};
