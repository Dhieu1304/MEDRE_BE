const nodeCache = require('../config/nodeCache');
const models = require('../models');
const logger = require('../config/logger');

const initGlobalSetting = async () => {
  const globalSetting = await models.global_setting.findAll({ raw: true });
  nodeCache.set('globalSetting', globalSetting);
  logger.info('----------------- INIT GLOBAL SETTING -----------------');
};

const getGlobalSetting = () => {
  return nodeCache.get(`globalSetting`);
};

module.exports = {
  initGlobalSetting,
  getGlobalSetting,
};
