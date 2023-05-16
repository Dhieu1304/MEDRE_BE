const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { getGlobalSetting, initGlobalSetting } = require('../nodeCache/globalSetting');
const { responseData, responseMessage } = require('../utils/responseFormat');
const globalSettingService = require('./global_setting.service');

const getSetting = catchAsync(async (req, res) => {
  const globalSetting = getGlobalSetting();
  return res.status(httpStatus.OK).json(responseData(globalSetting));
});

const editSetting = catchAsync(async (req, res) => {
  const { id, value } = req.body;
  await globalSettingService.updateGlobalSetting(id, value);
  await initGlobalSetting();
  return res.status(httpStatus.OK).json(responseMessage('Edit global setting successfully'));
});

module.exports = {
  getSetting,
  editSetting,
};
