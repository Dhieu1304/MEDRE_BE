const models = require('../models');
const { v4: uuidv4 } = require('uuid');
const scheduleService = require('../schedule/schedule.service');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const create = async (data) => {
  data.id = uuidv4();
  return models.history_booking.create(data);
};

const findOneByFilter = async (filter) => {
  return await models.history_booking.findOne({ where: filter });
};

const findAllByFilter = async (filter) => {
  return await models.history_booking.findAll({ where: filter });
};

const updateStatus = async (data) => {
  const booking = await findOneByFilter({ id_booking: data.id });
  if (!booking) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid booking id');
  }
  booking.booking_status = data.booking_status;
  if(data.note)
  {
    booking.note = data.note;
  }
  await booking.save();
  return booking;
};

module.exports = {
  create,
  findOneByFilter,
  findAllByFilter,
  updateStatus,
};
