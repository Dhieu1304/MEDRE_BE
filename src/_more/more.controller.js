const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, paginationFormat, responseMessage } = require('../utils/responseFormat');
const moreService = require('./more.service');

const queueJob = catchAsync(async (req, res) => {
  const amount = req.query.amount || 1;
  await moreService.buyAmount(amount);
  return res.status(httpStatus.OK).json(responseMessage(`Buy ${amount} successfully`));
});

module.exports = {
  queueJob,
};
