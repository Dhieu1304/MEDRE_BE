/*
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../user/user.service');
const authService = require('./auth.service');
const { responseData } = require('../utils/responseFormat');
const { historyLoginService } = require('../services.init');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  return res.status(httpStatus.CREATED).json(responseData(user, 'Register successfully'));
});

const loginEmailPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await authService.generateAuthTokens(user);
  await historyLoginService.createHistoryLogin({
    userId: new Types.ObjectId(user._id),
    accessToken: tokens.access.token,
    refreshToken: tokens.refresh.token,
    historyType: HISTORY_LOGIN.EMAIL,
  });
  return res.status(httpStatus.OK).json(responseData({ user, tokens }, 'Login successfully'));
});

const loginPhonePassword = catchAsync(async (req, res) => {
  const { phoneNumber, password } = req.body;
  const user = await authService.loginUserWithPhoneNumberAndPassword(phoneNumber, password);
  const tokens = await authService.generateAuthTokens(user);
  await historyLoginService.createHistoryLogin({
    userId: new Types.ObjectId(user._id),
    accessToken: tokens.access.token,
    refreshToken: tokens.refresh.token,
    historyType: HISTORY_LOGIN.PHONE,
  });
  return res.status(httpStatus.OK).json(responseData({ user, tokens }, 'Login successfully'));
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  return res.status(httpStatus.OK).json(responseData(tokens, 'Refresh token successfully'));
});

module.exports = {
  register,
  loginEmailPassword,
  loginPhonePassword,
  refreshTokens,
};
*/
