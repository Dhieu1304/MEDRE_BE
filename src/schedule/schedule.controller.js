const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const scheduleService = require('./schedule.service');
const { Op } = require('sequelize');
const models = require('../models');
const moment = require('moment');
const { BOOKING_STATUS } = require('../booking/booking.constant');
const { v4: uuidv4 } = require('uuid');

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
  return res.status(httpStatus.OK).json(responseData(listScheduleByDay, 'Successful'));
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
        where: { booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
        [Op.and]: [{date: { [Op.gte]: from }}, {date: { [Op.lte]: to }}]},
      },
    ],
  };
  const listSchedule = await scheduleService.findAllByOption(options);
  return res.status(httpStatus.OK).json(responseData(listSchedule, 'Successful'));
});

const createSchedule = catchAsync(async (req, res) => {
  const { id_doctor, apply_from, apply_to, data } = req.body;
  const schedules = data.map((item) => {
    return {
      id: uuidv4(),
      id_doctor,
      apply_from,
      apply_to,
      id_time: item.id_time,
      day_of_week: item.day_of_week,
      type: item.type,
    };
  });
  await scheduleService.createSchedule(schedules);
  return res.status(httpStatus.OK).json(responseMessage('Create schedule successfully'));
});

module.exports = {
  listByDay,
  listAll,
  createSchedule,
};
