const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData } = require('../utils/responseFormat');
const { STATISTIC_TIME } = require('./statistic.constant');
const moment = require('moment');
const statisticService = require('./statistic.service');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { BOOKING_STATUS } = require('../booking/booking.constant');

const convertTimeToStartEnd = (time) => {
  const currentDay = moment();
  let startDay = currentDay;
  switch (time) {
    case STATISTIC_TIME.DAY: {
      startDay = currentDay.subtract(7, 'days');
      break;
    }
    case STATISTIC_TIME.WEEK: {
      startDay = currentDay.subtract(4, 'weeks');
      break;
    }
    case STATISTIC_TIME.MONTH: {
      startDay = currentDay.subtract(12, 'months');
      break;
    }
    case STATISTIC_TIME.YEAR: {
      startDay = currentDay.subtract(10, 'years');
      break;
    }
    default: {
      break;
    }
  }
  return startDay;
};

const statisticBooking = catchAsync(async (req, res) => {
  const { time } = req.query;
  const startDay = convertTimeToStartEnd(time);
  const condition = {
    where: {
      createdAt: { [Op.gte]: startDay },
      booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
    },
    attributes: [
      [sequelize.fn('date_trunc', time.toLowerCase(), sequelize.col('createdAt')), 'time'],
      [sequelize.fn('count', sequelize.col('booking.id')), 'total'],
    ],
    group: ['time'],
    order: [['time', 'asc']],
  };
  const data = await statisticService.findAllStatisticByCondition('booking', condition);
  return res.status(httpStatus.OK).json(responseData(data));
});

const statisticUser = catchAsync(async (req, res) => {
  const { time } = req.query;
  const startDay = convertTimeToStartEnd(time);
  const condition = {
    where: { createdAt: { [Op.gte]: startDay } },
    attributes: [
      [sequelize.fn('date_trunc', time.toLowerCase(), sequelize.col('createdAt')), 'time'],
      [sequelize.fn('count', sequelize.col('id')), 'total'],
    ],
    group: ['time'],
    order: [['time', 'asc']],
  };
  const data = await statisticService.findAllStatisticByCondition('user', condition);
  return res.status(httpStatus.OK).json(responseData(data));
});

module.exports = {
  statisticBooking,
  statisticUser,
};
