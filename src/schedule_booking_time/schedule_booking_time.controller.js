const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, paginationFormat } = require('../utils/responseFormat');
const pick = require('../utils/pick');
const pageLimit2Offset = require('../utils/pageLimit2Offset');
const scheduleBookingTimeService = require('./schedule_booking_time.service');

const getList = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const filter = pick(req.query, ['id_expertise', 'id_time_schedule']);

  const condition = {
    where: filter,
    ...pageLimit2Offset(page, limit),
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
  };

  const listScheduleBookingTime = await scheduleBookingTimeService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(listScheduleBookingTime, page, limit)));
});

module.exports = {
  getList,
};
