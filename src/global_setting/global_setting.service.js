const models = require('../models');

const updateGlobalSetting = async (id, value) => {
  return await models.global_setting.update({ value }, { where: { id } });
};

module.exports = {
  updateGlobalSetting,
};
