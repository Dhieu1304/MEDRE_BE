const staffPermission = (permission) => {
  return (req, res, next) => {
    if (!permission.includes(req.user.role)) {
      res.status(403).json({ status: false, message: `You do not have this permission` });
    } else {
      next();
    }
  };
};

module.exports = {
  staffPermission,
};
