const adminPermission = (permission) => {
  return (req, res, next) => {
    if (!permission.includes(req.Admin.permission)) {
      res.status(403).json({ status: false, message: `You do not have this permission` });
    } else {
      next();
    }
  };
};

module.exports = {
  adminPermission,
};
