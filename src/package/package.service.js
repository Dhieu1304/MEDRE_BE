const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const i18next = require('i18next');
const { v4: uuidv4 } = require('uuid');

const findOneByFilter = async (filter) => {
  return await models.package.findOne({ where: filter });
};

const findAllByFilter = async (filter) => {
  return await models.package.findAll({ where: filter });
};

const updatePrice = async (id_package, price) => {
  const packageData = await findOneByFilter({ id: id_package });
  if (!packageData) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('package.notFound'));
  }
  await packageData.update({ price: price });
  return packageData;
};

const createPackage = async (data) => {
  // generate uuid
  data.id = uuidv4();

  // create new user
  return models.package.create(data);
};

const deletePackage = async (data) => {
  const packageData = await findOneByFilter({ id: data });
  if (!packageData) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('package.notFound'));
  }

  // delete package
  return await models.package.destroy({ where: { id: packageData.id } });
};

module.exports = {
  findOneByFilter,
  findAllByFilter,
  updatePrice,
  createPackage,
  deletePackage,
};
