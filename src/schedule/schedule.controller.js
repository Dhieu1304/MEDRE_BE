const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const scheduleService = require('./schedule.service');
const { Op } = require('sequelize');
const models = require('../models');
const moment = require('moment');
const { BOOKING_STATUS } = require('../booking/booking.constant');
const i18next = require('i18next');
const { regexpRepeatOnFromTo } = require('../utils/regexpRepeatOnFromTo');

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
    [Op.or]: [{ apply_from: { [Op.lte]: to } }, { apply_to: { [Op.gte]: from } }],
  };

  const regexpRepeatOn = regexpRepeatOnFromTo(from, to);
  if (!regexpRepeatOn.status) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(regexpRepeatOn.data, false));
  } else if (regexpRepeatOn.data) {
    filter.repeat_on = { [Op.regexp]: regexpRepeatOn.data };
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
