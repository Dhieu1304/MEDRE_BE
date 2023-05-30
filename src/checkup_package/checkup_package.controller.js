const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseMessage, responseData, paginationFormat } = require('../utils/responseFormat');
const i18next = require('i18next');
const checkupPackageService = require('./checkup_package.service');
const pageLimit2Offset = require('../utils/pageLimit2Offset');

const getCheckupPackage = catchAsync(async (req, res) => {
  const id_checkup_package = req.params.id;
  const checkup_package = await checkupPackageService.findOneByFilter({ id: id_checkup_package });
  return res.status(httpStatus.OK).json(responseData(checkup_package));
});

const updateCheckupPackage = catchAsync(async (req, res) => {
  const id_checkup_package = req.params.id;
  const data = req.body;
  await checkupPackageService.updateCheckupPackage(id_checkup_package, data);
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('checkupPackage.success')));
});

const getAllCheckupPackageByExpertise = catchAsync(async (req, res) => {
  const id_expertise = req.params.id;
  const checkup_packages = await checkupPackageService.findAllByFilter({ id_expertise: id_expertise });
  return res.status(httpStatus.OK).json(responseData(checkup_packages));
});

const getAllCheckupPackage = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const condition = {
    ...pageLimit2Offset(page, limit),
  };
  const checkup_packages = await checkupPackageService.findAndCountAllByCondition(condition);
  console.log(checkup_packages);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(checkup_packages, page, limit)));
});

const createCheckupPackage = catchAsync(async (req, res) => {
  const checkup_package = await checkupPackageService.createCheckupPackage(req.body);
  return res.status(httpStatus.OK).json(responseData(checkup_package));
});

const deleteCheckupPackage = catchAsync(async (req, res) => {
  await checkupPackageService.deleteCheckupPackage(req.params.id);
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('checkupPackage.delete')));
});

module.exports = {
  getCheckupPackage,
  updateCheckupPackage,
  createCheckupPackage,
  getAllCheckupPackageByExpertise,
  getAllCheckupPackage,
  deleteCheckupPackage,
};
