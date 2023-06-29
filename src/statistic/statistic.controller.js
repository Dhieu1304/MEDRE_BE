const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData } = require('../utils/responseFormat');
const { STATISTIC_TIME } = require('./statistic.constant');
const moment = require('moment');
const statisticService = require('./statistic.service');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { BOOKING_STATUS } = require('../booking/booking.constant');
const models = require('../models');
const { SCHEDULE_TYPE } = require('../schedule/schedule.constant');
const _ = require('lodash');

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
  const { time, from, to } = req.query;
  const condition = {
    raw: true,
    where: {
      [Op.and]: [{ createdAt: { [Op.gte]: from } }, { createdAt: { [Op.lte]: to } }],
      booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
    },
    include: [
      {
        model: models.schedule,
        as: 'booking_schedule',
        where: { type: SCHEDULE_TYPE.OFFLINE },
        attributes: [],
      },
    ],
    attributes: [
      [sequelize.fn('date_trunc', time.toLowerCase(), sequelize.col('booking.createdAt')), 'time'],
      [sequelize.fn('count', sequelize.col('booking.id')), 'totalOff'],
    ],
    group: ['time'],
    order: [['time', 'asc']],
  };
  const dataOffline = await statisticService.findAllStatisticByCondition('booking', condition);
  condition.include[0].where.type = SCHEDULE_TYPE.ONLINE;
  condition.attributes[1][1] = 'totalOnl';
  const dataOnline = await statisticService.findAllStatisticByCondition('booking', condition);
  const data = _(dataOnline).concat(dataOffline).groupBy('time').map(_.spread(_.merge)).value();
  return res.status(httpStatus.OK).json(responseData(data));
});

const statisticUser = catchAsync(async (req, res) => {
  const { time, from, to } = req.query;
  const condition = {
    where: { [Op.and]: [{ createdAt: { [Op.gte]: from } }, { createdAt: { [Op.lte]: to } }] },
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

const statisticPatient = catchAsync(async (req, res) => {
  const { time, from, to } = req.query;
  const condition = {
    where: { [Op.and]: [{ createdAt: { [Op.gte]: from } }, { createdAt: { [Op.lte]: to } }] },
    attributes: [
      [sequelize.fn('date_trunc', time.toLowerCase(), sequelize.col('createdAt')), 'time'],
      [sequelize.fn('count', sequelize.col('id')), 'total'],
    ],
    group: ['time'],
    order: [['time', 'asc']],
  };
  const data = await statisticService.findAllStatisticByCondition('patient', condition);
  return res.status(httpStatus.OK).json(responseData(data));
});

const statisticRevenue = catchAsync(async (req, res) => {
  const { time, from, to } = req.query;

  const condition = {
    raw: true,
    where: {
      is_payment: true,
      [Op.and]: [{ createdAt: { [Op.gte]: from } }, { createdAt: { [Op.lte]: to } }],
    },
    include: [
      {
        model: models.schedule,
        as: 'booking_schedule',
        where: { type: SCHEDULE_TYPE.OFFLINE },
        include: [
          {
            model: models.expertise,
            as: 'schedule_expertise',
            attributes: [],
          },
        ],
        attributes: [],
      },
    ],
    attributes: [
      [sequelize.fn('date_trunc', time.toLowerCase(), sequelize.col('booking.createdAt')), 'time'],
      [sequelize.fn('sum', sequelize.col(`booking_schedule.schedule_expertise.price_offline`)), 'totalOff'],
    ],
    group: ['time'],
    order: [['time', 'asc']],
  };
  const dataOffline = await statisticService.findAllStatisticByCondition('booking', condition);
  condition.include[0].where.type = SCHEDULE_TYPE.ONLINE;
  condition.attributes[1] = [
    sequelize.fn('sum', sequelize.col(`booking_schedule.schedule_expertise.price_online`)),
    'totalOnl',
  ];
  const dataOnline = await statisticService.findAllStatisticByCondition('booking', condition);
  const data = _(dataOnline).concat(dataOffline).groupBy('time').map(_.spread(_.merge)).value();
  return res.status(httpStatus.OK).json(responseData(data));
});

module.exports = {
  statisticBooking,
  statisticUser,
  statisticPatient,
  statisticRevenue,
  convertTimeToStartEnd,
};
