const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const i18next = require('i18next');
const { v4: uuidv4 } = require('uuid');

const findOneByFilter = async (filter) => {
    return await models.pricing.findOne({ where: filter });
};
  
const findAllByFilter = async (filter) => {
    return await models.pricing.findAll({ where: filter });
};

const updatePrice = async (id_package, price) => {
    const package = await findOneByFilter({ id: id_package });
    if(!package)
    {
        throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('package.notFound'));
    }
    await package.update({ price: price });
    return package;
};

const createPackage = async (data) => {
  // generate uuid
  data.id = uuidv4();

  // create new user
  return models.package.create(data);
};

const deletePackage = async (data) => {
    const package = await findOneByFilter({ id: data });
    if (!package) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('package.notFound'));
    }
  
    // delete package
    return await models.package.destroy({ where: { id: package.id } });
  };

module.exports = {
    findOneByFilter,
    findAllByFilter,
    updatePrice,
    createPackage,
    deletePackage,
};
