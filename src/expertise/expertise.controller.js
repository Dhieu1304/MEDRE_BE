const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { responseData } = require('../utils/responseFormat');
const expertiseService = require('./expertise.service');

const listExpertise = catchAsync(async (req, res) => {
  const expertises = await expertiseService.findAllByFilter();
  return res.status(httpStatus.CREATED).json(responseData(expertises));
});

module.exports = {
  listExpertise,
};
