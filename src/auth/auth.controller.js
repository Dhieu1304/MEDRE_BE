const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../user/user.service');
const authService = require('./auth.service');
const { responseData } = require('../utils/responseFormat');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  return res.status(httpStatus.CREATED).json(responseData(user, 'Register successfully'));
});

const loginEmailPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await authService.generateAuthTokens(user);
  user.refresh_token = tokens.refresh.token;
  await user.save();
  return res.status(httpStatus.OK).json(responseData({ user, tokens }, 'Login successfully'));
});

const adminLoginEmailPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const staff = await authService.adminLoginUserWithEmailAndPassword(email, password);
  const tokens = await authService.generateAuthTokens(staff);
  staff.refresh_token = tokens.refresh.token;
  await staff.save();
  return res.status(httpStatus.OK).json(responseData({ staff, tokens }, 'Login successfully'));
});

const loginPhonePassword = catchAsync(async (req, res) => {
  const { phone_number, password } = req.body;
  const user = await authService.loginUserWithPhoneNumberAndPassword(phone_number, password);
  const tokens = await authService.generateAuthTokens(user);
  user.refresh_token = tokens.refresh.token;
  await user.save();
  return res.status(httpStatus.OK).json(responseData({ user, tokens }, 'Login successfully'));
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refresh_token);
  return res.status(httpStatus.OK).json(responseData(tokens, 'Refresh token successfully'));
});

module.exports = {
  register,
  loginEmailPassword,
  loginPhonePassword,
  refreshTokens,
  adminLoginEmailPassword,
};
