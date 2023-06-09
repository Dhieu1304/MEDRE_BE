const nodeCache = require('../config/nodeCache');
const models = require('../models');
const { GLOBAL_SETTING } = require('../global_setting/global_setting.constant');

const initGlobalSetting = async () => {
  const globalSetting = await models.global_setting.findAll({ raw: true });
  nodeCache.set(GLOBAL_SETTING.NAME, globalSetting, 0);
};

const getGlobalSetting = () => {
  return nodeCache.get(GLOBAL_SETTING.NAME);
};

const getGlobalSettingByName = (name) => {
  const globalSetting = nodeCache.get(GLOBAL_SETTING.NAME);
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
