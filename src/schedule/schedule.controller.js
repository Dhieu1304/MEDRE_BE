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
  const filter = { id_doctor };
  filter.day_of_week = moment(date).day();
  const options = {
    where: filter,
    include: [
      { model: models.time_schedule, as: 'time_schedule', attributes: { exclude: ['createdAt', 'updatedAt'] } },
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
  // todo: add from -> list booking, day_off
  const { id_doctor, from, to } = req.query;
  const filter = { id_doctor, apply_to: { [Op.gte]: to } };
  const options = {
    where: filter,
    include: [
      { model: models.time_schedule, as: 'time_schedule', attributes: { exclude: ['createdAt', 'updatedAt'] } },
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
