const i18next = require('i18next');
const httpStatus = require('http-status');

const staffPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ status: false, message: i18next.t('error.unauthorized') });
    }
    if (!permission.includes(req.user.role)) {
      return res.status(httpStatus.FORBIDDEN).json({ status: false, message: i18next.t('unCategory.permission') });
    }
    next();
  };
};

module.exports = {
  staffPermission,
};
