const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData } = require('../utils/responseFormat');
const scheduleService = require('./schedule.service');
const pick = require('../utils/pick');
const { Op } = require('sequelize');
const models = require('../models');

const listByDay = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['id_doctor', 'date']);
  const listScheduleByDay = await scheduleService.findAllByFilter(filter);
  return res.status(httpStatus.OK).json(responseData(listScheduleByDay, 'Successful'));
});

const listFromTo = catchAsync(async (req, res) => {
  const { id_doctor, from, to } = req.query;
  const filter = { id_doctor, [Op.and]: [{ date: { [Op.gte]: from } }, { date: { [Op.lte]: to } }] };
  const options = {
    where: filter,
    include: [{ model: models.time_schedule, as: 'time_schedule', attributes: { exclude: ['createdAt', 'updatedAt'] } }],
    attributes: { exclude: ['createdAt', 'updatedAt', 'id_time', 'id_doctor'] },
  };
  const listScheduleByDay = await scheduleService.findAllByOption(options);
  return res.status(httpStatus.OK).json(responseData(listScheduleByDay, 'Successful'));
});

module.exports = {
  listByDay,
  listFromTo,
};
