const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const scheduleService = require('./schedule.service');
const { Op } = require('sequelize');
const models = require('../models');
const moment = require('moment');
const { BOOKING_STATUS } = require('../booking/booking.constant');
const i18next = require('i18next');

const listByDay = catchAsync(async (req, res) => {
  const { id_doctor, date } = req.query;
  const filter = {
    id_doctor,
    repeat_on: { [Op.substring]: moment(date).day() },
    apply_to: { [Op.gte]: date },
  };
  const options = {
    where: filter,
    include: [
      { model: models.expertise, as: 'schedule_expertise', attributes: { exclude: ['createdAt', 'updatedAt'] } },
      {
        model: models.booking,
        as: 'bookings',
        required: false,
        where: { booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED }, date },
      },
    ],
  };
  const listScheduleByDay = await scheduleService.findAllByOption(options);
  return res.status(httpStatus.OK).json(responseData(listScheduleByDay, i18next.t('schedule.success')));
});

const listAll = catchAsync(async (req, res) => {
  const { id_doctor, from, to } = req.query;

  const filter = {
    id_doctor,
    // apply_from: { [Op.lte]: from },
    apply_to: { [Op.gte]: to },
  };

  // subtract date
  const range = moment(to).diff(moment(from), 'days');
  if (range < 0) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('Invalid date from to', false));
  } else if (range < 6) {
    let repeat_on = [];
    for (let i = from; i <= to; i = moment(i).add(1, 'days')) {
      repeat_on.push(moment(i).day());
    }

    // sort repeat_on
    repeat_on = repeat_on.sort((a, b) => {
      return a - b;
    });

    // convert regexp string
    let regexp = '^[';
    repeat_on.map((item) => {
      regexp += item + '|';
    });
    regexp = regexp.slice(0, -1) + ']';
    filter.repeat_on = { [Op.regexp]: regexp };
  }

  const options = {
    where: filter,
    include: [
      { model: models.expertise, as: 'schedule_expertise', attributes: { exclude: ['createdAt', 'updatedAt'] } },
      {
        model: models.booking,
        as: 'bookings',
        required: false,
        where: {
          booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
          [Op.and]: [{ date: { [Op.gte]: from } }, { date: { [Op.lte]: to } }],
        },
      },
    ],
  };
  const listSchedule = await scheduleService.findAllByOption(options);
  return res.status(httpStatus.OK).json(responseData(listSchedule, i18next.t('schedule.success')));
});

const createSchedule = catchAsync(async (req, res) => {
  await scheduleService.createSchedule(req.body);
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('schedule.create')));
});

const changeApplyToAllSchedule = catchAsync(async (req, res) => {
  const { id_doctor, apply_to } = req.body;
  await scheduleService.changeApplyToAllSchedule(id_doctor, apply_to);
  return res.status(httpStatus.OK).json(responseMessage('Update apply to all schedule successfully'));
});

const changeApplyToSchedule = catchAsync(async (req, res) => {
  const { id, apply_to } = req.body;
  await scheduleService.changeApplyToSchedule(id, apply_to);
  return res.status(httpStatus.OK).json(responseMessage('Update apply to schedule successfully'));
});

module.exports = {
  listByDay,
  listAll,
  createSchedule,
  changeApplyToAllSchedule,
  changeApplyToSchedule,
};
