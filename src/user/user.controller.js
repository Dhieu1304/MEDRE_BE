const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const userService = require('./user.service');

const getInfo = catchAsync(async (req, res) => {
  const user = await userService.findOneByFilter({ id: req.user.id });
  if (!user) {
    return res.status(httpStatus.OK).json(responseMessage('User not found', false));
  }
  return res.status(httpStatus.OK).json(responseData(user));
});

const getDetailUser = catchAsync(async (req, res) => {
  const user = await userService.findOneByFilter({ id: req.params.id });
  if (!user) {
    return res.status(httpStatus.OK).json(responseMessage('User not found', false));
  }
  return res.status(httpStatus.OK).json(responseData(user));
});

const getAll = catchAsync(async (req, res) => {
  const users = await userService.findAllByFilter();
  return res.status(httpStatus.OK).json(responseData(users));
});

module.exports = {
  getInfo,
  getDetailUser,
  getAll,
};
