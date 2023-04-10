const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const userService = require('./user.service');

const getInfo = catchAsync(async (req, res) => {
  let user = await userService.findOneByFilter({ id: req.user.id });
  if (!user) {
    return res.status(httpStatus.OK).json(responseMessage('User not found', false));
  }
  user = user.toJSON();
  delete user.password;
  delete user.refresh_token;
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

const editProfile = catchAsync(async (req, res) => {
  const id = req.user.id;
  const user = await userService.editUser(id, req.body);
  return res.status(httpStatus.OK).json(responseData(user, "Change profile successfully."));
});

const changePassword = catchAsync(async (req, res) => {
  const id = req.user.id;
  const user = await userService.changePassword(id, req.body);
  return res.status(httpStatus.OK).json(responseData(user, "Change password successfully."));
});

module.exports = {
  getInfo,
  getDetailUser,
  getAll,
  editProfile,
  changePassword,
};
