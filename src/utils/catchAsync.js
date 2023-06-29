const { responseMessage } = require('./responseFormat');
const httpStatus = require('http-status');

const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error(err);
      const httpCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
      const status = httpCode < 400;
      return res.status(httpCode).json(responseMessage(err.message, status));
    });
  };
};

module.exports = catchAsync;
