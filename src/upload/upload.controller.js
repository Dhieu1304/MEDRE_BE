const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const uploadService = require('./upload.service');

const uploadAvatar = catchAsync(async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('Invalid file', false));
  }
  const data = await uploadService.uploadFile(file, 'picture');
  return res.status(httpStatus.OK).json(responseData(data));
});

module.exports = {
  uploadAvatar,
};
