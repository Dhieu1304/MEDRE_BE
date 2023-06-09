const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage, paginationFormat } = require('../utils/responseFormat');
const pick = require('../utils/pick');
const pageLimit2Offset = require('../utils/pageLimit2Offset');
const logger = require('../config/logger');

const getList = catchAsync(async (req, res, next) => {});

module.exports = {
  getList,
};
