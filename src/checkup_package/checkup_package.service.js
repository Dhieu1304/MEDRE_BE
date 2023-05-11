const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const i18next = require('i18next');
const { v4: uuidv4 } = require('uuid');

const findOneByFilter = async (filter) => {
    return await models.checkup_package.findOne({ where: filter });
};
  
const findAllByFilter = async (filter) => {
    return await models.checkup_package.findAll({ where: filter });
};

const updatePrice = async (id_checkup_package, price) => {
    const checkup_package = await findOneByFilter({ id: id_checkup_package });
    if(!checkup_package)
    {
        throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('checkupPackage.notFound'));
    }
    await checkup_package.update({ price: price });
    return checkup_package;
};

const createCheckupPackage = async (data) => {
  // generate uuid
  data.id = uuidv4();

  // create new user
  return models.package.create(data);
};

const deleteCheckupPackage = async (data) => {
    const checkup_package = await findOneByFilter({ id: data });
    if (!checkup_package) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('checkupPackage.notFound'));
    }
  
    // delete package
    return await models.checkup_package.destroy({ where: { id: checkup_package.id } });
  };

module.exports = {
    findOneByFilter,
    findAllByFilter,
    updatePrice,
    createCheckupPackage,
    deleteCheckupPackage,
};
