const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../user/user.service');
const authService = require('./auth.service');
const { responseData } = require('../utils/responseFormat');
const i18next = require('i18next');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  return res.status(httpStatus.CREATED).json(responseData(user, i18next.t('auth.registerSuccess')));
});

const loginEmailPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await authService.generateAuthTokens(user);
  user.refresh_token = tokens.refresh.token;
  await user.save();
  return res.status(httpStatus.OK).json(responseData({ user, tokens }, i18next.t('auth.loginSuccess')));
});

const staffLoginEmailPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const staff = await authService.staffLoginUserWithEmailAndPassword(email, password);
  const tokens = await authService.generateAuthTokens(staff);
  staff.refresh_token = tokens.refresh.token;
  await staff.save();
  return res.status(httpStatus.OK).json(responseData({ staff, tokens }, i18next.t('auth.loginSuccess')));
});

const loginPhonePassword = catchAsync(async (req, res) => {
  const { phone_number, password } = req.body;
  const user = await authService.loginUserWithPhoneNumberAndPassword(phone_number, password);
  const tokens = await authService.generateAuthTokens(user);
  user.refresh_token = tokens.refresh.token;
  await user.save();
  return res.status(httpStatus.OK).json(responseData({ user, tokens }, i18next.t('auth.loginSuccess')));
});

const staffLoginPhonePassword = catchAsync(async (req, res) => {
  const { phone_number, password } = req.body;
  const staff = await authService.staffLoginUserWithPhoneNumberAndPassword(phone_number, password);
  const tokens = await authService.generateAuthTokens(staff);
  staff.refresh_token = tokens.refresh.token;
  await staff.save();
  return res.status(httpStatus.OK).json(responseData({ staff, tokens }, i18next.t('auth.loginSuccess')));
});

const staffLoginUsernamePassword = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const staff = await authService.staffLoginUserWithUsernameAndPassword(username, password);
  const tokens = await authService.generateAuthTokens(staff);
  staff.refresh_token = tokens.refresh.token;
  await staff.save();
  return res.status(httpStatus.OK).json(responseData({ staff, tokens }, i18next.t('auth.loginSuccess')));
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refresh_token);
  return res.status(httpStatus.OK).json(responseData(tokens, i18next.t('refreshToken.refreshTokenSuccess')));
});

const staffRefreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.staffRefreshAuth(req.body.refresh_token);
  return res.status(httpStatus.OK).json(responseData(tokens, i18next.t('refreshToken.refreshTokenSuccess')));
});

module.exports = {
  register,
  loginEmailPassword,
  loginPhonePassword,
  refreshTokens,

  // staff
  staffLoginEmailPassword,
  staffLoginPhonePassword,
  staffLoginUsernamePassword,
  staffRefreshTokens,
};
