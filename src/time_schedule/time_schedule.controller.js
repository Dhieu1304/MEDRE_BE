const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData } = require('../utils/responseFormat');
const timeScheduleService = require('./time_schedule.service');
const i18next = require('i18next');

const getTimeSchedule = catchAsync(async (req, res) => {
  const timeSchedule = await timeScheduleService.findAllByFilter({ order: ['time_start'] });
  return res.status(httpStatus.OK).json(responseData(timeSchedule,i18next.t('timeSchedule.success')));
});

module.exports = {
  getTimeSchedule,
};
