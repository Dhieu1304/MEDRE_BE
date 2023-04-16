const getIpAddress = () => {
  return (req, res, next) => {
    req.ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    next();
  };
};

module.exports = getIpAddress;
