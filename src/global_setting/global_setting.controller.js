const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { getGlobalSetting, initGlobalSetting } = require('../nodeCache/global_setting');
const { responseData, responseMessage } = require('../utils/responseFormat');
const globalSettingService = require('./global_setting.service');
const i18next = require('i18next');

const getSetting = catchAsync(async (req, res) => {
  const globalSetting = getGlobalSetting();
  return res.status(httpStatus.OK).json(responseData(globalSetting));
});

const editSetting = catchAsync(async (req, res) => {
  const { id, value } = req.body;
  await globalSettingService.updateGlobalSetting(id, value);
  await initGlobalSetting();
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('unCategory.globalSettingEdit')));
});

module.exports = {
  getSetting,
  editSetting,
};
