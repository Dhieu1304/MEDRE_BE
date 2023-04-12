const i18next = require('i18next');

const staffPermission = (permission) => {
  return (req, res, next) => {
    if (!permission.includes(req.user.role)) {
      res.status(403).json({ status: false, message: i18next.t('unCategory.permission') });
    } else {
      next();
    }
  };
};

module.exports = {
  staffPermission,
};
