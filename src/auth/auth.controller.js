const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../user/user.service');
const staffService = require('../staff/staff.service');
const authService = require('./auth.service');
const { responseData, responseMessage } = require('../utils/responseFormat');
const i18next = require('i18next');
// const sendSMS = require('../otp/sms');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const mail = req.body.email;
  const phone = req.body.phone_number;
  res.status(httpStatus.CREATED).json(responseData(user, i18next.t('auth.registerSuccess')));
  // only running underground
  if (mail) {
    await authService.sendMailVerification(mail, 1);
  }
  if (phone) {
    // await sendSMS();
  }
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

const verifySuccess = catchAsync(async (req, res) => {
  const token = req.params.token;
  const result = await authService.verifyEmail(token);
  if (result === true) {
    res.send(
      `<h1 style="overflow: hidden;display: flex;justify-content: center;align-items: center;">
      ${i18next.t('auth.verifySuccess')}
      </h1>`
    );
  } else {
    res.send(
      `<h1 style="overflow: hidden;display: flex;justify-content: center;align-items: center;">
      ${i18next.t('auth.verifyFailure')}
      </h1>`
    );
  }
});

const resendMail = catchAsync(async (req, res) => {
  const { email, type } = req.body;
  if (type == 1) {
    const user = await userService.findOneByFilter({ email: email });
    if (user) {
      try {
        await authService.sendMailVerification(email, type);
        return res.status(httpStatus.OK).json(responseMessage(i18next.t('email.success'), true));
      } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('email.fail'), false));
      }
    }
  } else if (type == 2) {
    const staff = await staffService.findOneByFilter({ email: email });
    if (staff) {
      try {
        await authService.sendMailVerification(email, type);
        return res.status(httpStatus.OK).json(responseMessage(i18next.t('email.success'), true));
      } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('email.fail'), false));
      }
    }
  }
  return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('email.emailNotFound'), false));
});

const sendResetPasswordMail = catchAsync(async (req, res) => {
  const { email, type } = req.body;
  if (type == 1) {
    const user = await userService.findOneByFilter({ email: email });
    if (user) {
      try {
        await authService.sendMailResetPassword(email, type);
        return res.status(httpStatus.OK).json(responseMessage(i18next.t('email.success'), true));
      } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('email.fail'), false));
      }
    }
  } else if (type == 2) {
    const staff = await staffService.findOneByFilter({ email: email });
    if (staff) {
      try {
        await authService.sendMailResetPassword(email, type);
        return res.status(httpStatus.OK).json(responseMessage(i18next.t('email.success'), true));
      } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('email.fail'), false));
      }
    }
  }
  return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('email.emailNotFound'), false));
});

const resetPassword = catchAsync(async (req, res) => {
  const { token, new_password, confirm_password } = req.body;
  const result = await authService.resetPassword(token, new_password, confirm_password);
  if (result) {
    return res.status(httpStatus.OK).json(responseMessage(i18next.t('password.changePassword'), true));
  } else {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('password.changePasswordFailure'), false));
  }
});

module.exports = {
  register,
  loginEmailPassword,
  loginPhonePassword,
  refreshTokens,
  verifySuccess,
  resendMail,
  sendResetPasswordMail,
  resetPassword,

  // staff
  staffLoginEmailPassword,
  staffLoginPhonePassword,
  staffLoginUsernamePassword,
  staffRefreshTokens,
};
