const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const i18next = require('i18next');
const { isBlockedAccount } = require('../nodeCache/account');
const { getGlobalSettingByName } = require('../nodeCache/global_setting');
const { STAFF_ROLES } = require('../staff/staff.constant');
const { GLOBAL_SETTING } = require('../global_setting/global_setting.constant');
const { responseMessage } = require('../utils/responseFormat');

const verifyCallback = (req, resolve, reject) => {
  return async (err, user, info) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, i18next.t('error.unauthorized')));
    }

    if (user.role !== STAFF_ROLES.ADMIN) {
      if (getGlobalSettingByName(GLOBAL_SETTING.MAINTAIN) === '1') {
        return reject(new ApiError(httpStatus.BAD_REQUEST, i18next.t('error.maintain')));
      }
    }

    if (isBlockedAccount(user.id)) {
      return reject(new ApiError(httpStatus.BAD_REQUEST, i18next.t('block.blockAccount')));
    }

    req.user = user;
    resolve();
  };
};

const auth = () => {
  return async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
    })
      .then(() => {
        return next();
      })
      .catch((err) => {
        const httpCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const status = httpCode < 400;
        return res.status(httpCode).json(responseMessage(err.message, status));
      });
  };
};

module.exports = auth;
