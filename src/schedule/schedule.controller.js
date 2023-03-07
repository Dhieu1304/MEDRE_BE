const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData } = require('../utils/responseFormat');
const scheduleService = require('./schedule.service');
const pick = require('../utils/pick');

const listByDay = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['id_doctor', 'date']);
  const listScheduleByDay = await scheduleService.findAllByFilter(filter);
  return res.status(httpStatus.OK).json(responseData(listScheduleByDay, 'Successful'));
});

module.exports = {
  listByDay,
};
