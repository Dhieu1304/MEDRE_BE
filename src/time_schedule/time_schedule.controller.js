const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData } = require('../utils/responseFormat');
const timeScheduleService = require('./time_schedule.service');

const getTimeSchedule = catchAsync(async (req, res) => {
  const timeSchedule = await timeScheduleService.findAllByFilter({ order: ['time_start'] });
  return res.status(httpStatus.OK).json(responseData(timeSchedule, 'Successful'));
});

module.exports = {
  getTimeSchedule,
};
