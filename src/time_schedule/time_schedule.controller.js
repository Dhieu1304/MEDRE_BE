const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData } = require('../utils/responseFormat');
const { getTimeScheduleCache } = require('../nodeCache/time_shedule');

const getTimeSchedule = catchAsync(async (req, res) => {
  const timeSchedule = await getTimeScheduleCache();
  return res.status(httpStatus.OK).json(responseData(timeSchedule));
});

module.exports = {
  getTimeSchedule,
};
