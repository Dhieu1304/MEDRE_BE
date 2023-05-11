const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const i18next = require('i18next');
const { isBlockedAccount } = require('../nodeCache/account');
const { getGlobalSettingByName } = require('../nodeCache/globalSetting');
const { STAFF_ROLES } = require('../staff/staff.constant');

const verifyCallback = (req, resolve, reject) => {
  return async (err, user, info) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, i18next.t('error.unauthorized')));
    }

    if (user.role !== STAFF_ROLES.ADMIN) {
      if (getGlobalSettingByName('maintain') === '1') {
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
        return next(err);
      });
  };
};

module.exports = auth;
