const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../user/user.service');
const staffService = require('../staff/staff.service');
const authService = require('./auth.service');
const { responseData, responseMessage } = require('../utils/responseFormat');
const i18next = require('i18next');
const historyLoginService = require('../history_login/history_login.service');
const { LOGIN_TYPE } = require('../history_login/history_login.constant');
const path = require('path');
const { getGoogleDataAfterLogin, delGoogleDataAfterLogin } = require('../nodeCache/account');
// const sendSMS = require('../otp/sms');

const toResponseObject = (account) => {
  const result = account.toJSON();
  delete result.password;
  return result;
};

const register = catchAsync(async (req, res) => {
  const mail = req.body.email;
  const phone = req.body.phone_number;

  if (!mail && !phone) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('auth.missingInput'), false));
  }

  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).json(responseData(user, i18next.t('auth.registerSuccess')));
  // only running underground
  if (mail) {
    await authService.sendMailVerification(mail, 1);
  }
});

const loginEmailPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await authService.generateAuthTokens(user);
  await historyLoginService.createNew(user.id, null, LOGIN_TYPE.EMAIL, tokens.refresh.token, tokens.refresh.expires);
  return res.status(httpStatus.OK).json(responseData({ user: toResponseObject(user), tokens })); // i18next.t('auth.loginSuccess')
});

const staffLoginEmailPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const staff = await authService.staffLoginUserWithEmailAndPassword(email, password);
  const tokens = await authService.generateAuthTokens(staff);
  await historyLoginService.createNew(null, staff.id, LOGIN_TYPE.EMAIL, tokens.refresh.token, tokens.refresh.expires);
  return res.status(httpStatus.OK).json(responseData({ staff: toResponseObject(staff), tokens })); // i18next.t('auth.loginSuccess')
});

const loginPhonePassword = catchAsync(async (req, res) => {
  const { phone_number, password } = req.body;
  const user = await authService.loginUserWithPhoneNumberAndPassword(phone_number, password);
  const tokens = await authService.generateAuthTokens(user);
  await historyLoginService.createNew(user.id, null, LOGIN_TYPE.PHONE_NUMBER, tokens.refresh.token, tokens.refresh.expires);
  return res.status(httpStatus.OK).json(responseData({ user: toResponseObject(user), tokens })); // i18next.t('auth.loginSuccess')
});

const staffLoginPhonePassword = catchAsync(async (req, res) => {
  const { phone_number, password } = req.body;
  const staff = await authService.staffLoginUserWithPhoneNumberAndPassword(phone_number, password);
  const tokens = await authService.generateAuthTokens(staff);
  await historyLoginService.createNew(null, staff.id, LOGIN_TYPE.PHONE_NUMBER, tokens.refresh.token, tokens.refresh.expires);
  return res.status(httpStatus.OK).json(responseData({ staff: toResponseObject(staff), tokens })); // i18next.t('auth.loginSuccess')
});

const staffLoginUsernamePassword = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const staff = await authService.staffLoginUserWithUsernameAndPassword(username, password);
  const tokens = await authService.generateAuthTokens(staff);
  await historyLoginService.createNew(null, staff.id, LOGIN_TYPE.USERNAME, tokens.refresh.token, tokens.refresh.expires);
  return res.status(httpStatus.OK).json(responseData({ staff: toResponseObject(staff), tokens })); // i18next.t('auth.loginSuccess')
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refresh_token);
  return res.status(httpStatus.OK).json(responseData(tokens)); // i18next.t('refreshToken.refreshTokenSuccess')
});

const staffRefreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.staffRefreshAuth(req.body.refresh_token);
  return res.status(httpStatus.OK).json(responseData(tokens)); // i18next.t('refreshToken.refreshTokenSuccess')
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

const verifyOTPSuccess = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await authService.verifyOTP(data);
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
  const token = req.params.token;
  const new_password = req.body.new_password;
  const checkAccount = authService.checkAccount(token);
  if (!checkAccount) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('account.notFound'), false));
  }
  const result = await authService.resetPassword(token, new_password);
  if (result) {
    return res.status(httpStatus.OK).json(responseMessage(i18next.t('password.changePassword'), true));
  } else {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('password.changePasswordFailure'), false));
  }
  // if (result) {
  //   res.send(
  //     `<h1 style="overflow: hidden;display: flex;justify-content: center;align-items: center;">
  //     ${i18next.t('password.changePassword')}
  //     </h1>`
  //   );
  // } else {
  //   res.send(
  //     `<h1 style="overflow: hidden;display: flex;justify-content: center;align-items: center;">
  //     ${i18next.t('password.changePasswordFailure')}
  //     </h1>`
  //   );
  // }
});

const resetPasswordForm = catchAsync(async (req, res) => {
  //const token = req.params.token;
  res.sendFile('reset_password.html', { root: path.join(__dirname, '../reset_password') });
});

const failureLoginGoogle = catchAsync(async (req, res) => {
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('auth.ggFailure'), false));
});

const getDataLoginGoogle = catchAsync(async (req, res) => {
  const data = getGoogleDataAfterLogin(req.params.id);
  if (data) {
    delGoogleDataAfterLogin(req.params.id);
    return res.status(httpStatus.OK).json(responseData(data));
  }
  return res.status(httpStatus.BAD_REQUEST).json(responseMessage('Something wrong, please login again', false));
});

module.exports = {
  register,
  loginEmailPassword,
  loginPhonePassword,
  refreshTokens,
  verifySuccess,
  resendMail,
  sendResetPasswordMail,
  resetPasswordForm,
  resetPassword,
  verifyOTPSuccess,

  // staff
  staffLoginEmailPassword,
  staffLoginPhonePassword,
  staffLoginUsernamePassword,
  staffRefreshTokens,

  // oauth
  failureLoginGoogle,
  getDataLoginGoogle,

  toResponseObject,
};
