const { responseMessage } = require('./responseFormat');

const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (err.statusCode < 400) {
        return res.status(err.statusCode).json(responseMessage(err.message, false));
      }
      return next(err);
    });
  };
};

module.exports = catchAsync;
