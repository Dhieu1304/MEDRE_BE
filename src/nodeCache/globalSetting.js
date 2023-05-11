const nodeCache = require('../config/nodeCache');
const models = require('../models');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');

const initGlobalSetting = async () => {
  const globalSetting = await models.global_setting.findAll({ raw: true });
  nodeCache.set('globalSetting', globalSetting);
  logger.info('----------------- INIT GLOBAL SETTING -----------------');
};

const getGlobalSetting = () => {
  return nodeCache.get(`globalSetting`);
};

const getGlobalSettingByName = (name) => {
  const globalSetting = nodeCache.get(`globalSetting`);
  for (let i = 0; i < globalSetting.length; i++) {
    if (globalSetting[i].name === name) {
      return globalSetting[i].value;
    }
  }
  return '0';
};

module.exports = {
  initGlobalSetting,
  getGlobalSetting,
  getGlobalSettingByName,
};
