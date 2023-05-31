const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const i18next = require('i18next');
const { v4: uuidv4 } = require('uuid');
const bookingService = require('../booking/booking.service');
const moment = require('moment');
const { Op } = require('sequelize');

const findOneByFilter = async (filter) => {
  return await models.checkup_package.findOne({ where: filter });
};

const findAllByFilter = async (filter) => {
  return await models.checkup_package.findAll({ where: filter });
};

const findAndCountAllByCondition = async (condition) => {
  return await models.checkup_package.findAndCountAll(condition);
};

const updateCheckupPackage = async (id_checkup_package, data) => {
  let checkup_package = await findOneByFilter({ id: id_checkup_package });
  if (!checkup_package) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('checkupPackage.notFound'));
  }
  let filter = Object.assign({}, { date: { [Op.gt]: moment().subtract(1, 'd') } });
  filter.id_checkup_package = id_checkup_package;
  const booking = await bookingService.findAllByFilter(filter);
  if (booking.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('checkupPackage.cannotUpdate'));
  }
  checkup_package = Object.assign(checkup_package, data);
  return await checkup_package.save();
};

const createCheckupPackage = async (data) => {
  // generate uuid
  data.id = uuidv4();

  // create new checkup package
  return models.checkup_package.create(data);
};

const deleteCheckupPackage = async (data) => {
  const checkup_package = await findOneByFilter({ id: data });
  if (!checkup_package) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('checkupPackage.notFound'));
  }

  let filter = Object.assign({}, { date: { [Op.gt]: moment().subtract(1, 'd') } });
  filter.id_checkup_package = data;
  const booking = await bookingService.findAllByFilter(filter);
  if (booking.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('checkupPackage.cannotDelete'));
  }
  // delete package
  return await models.checkup_package.destroy({ where: { id: checkup_package.id } });
};

module.exports = {
  findOneByFilter,
  findAllByFilter,
  findAndCountAllByCondition,
  updateCheckupPackage,
  createCheckupPackage,
  deleteCheckupPackage,
};
