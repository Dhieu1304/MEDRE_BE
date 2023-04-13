const models = require('../models');
const logger = require('../config/logger');
const timeScheduleService = require('../time_schedule/time_schedule.service');
const { v4: uuidv4 } = require('uuid');

const findOneByFilter = async (filter) => {
  return await models.schedule.findOne({ where: filter });
};

const findAllByFilter = async (filter) => {
  return await models.schedule.findAll({ where: filter });
};

const findAllByOption = async (options = {}) => {
  return await models.schedule.findAll(options);
};

const findByDayOrGenerate = async (filter) => {
  try {
    const data = await findAllByFilter(filter);
    if (!data) {
      const bulkData = [];
      const time = await timeScheduleService.findAllByFilter();
      for (let i = 0; i < time.length; i++) {
        const schedule = {
          id: uuidv4(),
          id_doctor: filter.id_doctor,
          date: filter.date,
          id_time: time[i].id,
        };
        bulkData.push(schedule);
      }
      await models.schedule.bulkCreate(bulkData);
    }
  } catch (e) {
    logger.error(e.message);
  }
};

const createSchedule = async (data) => {
  return await models.schedule.bulkCreate(data);
};

module.exports = {
  findOneByFilter,
  findAllByFilter,
  findByDayOrGenerate,
  findAllByOption,
  createSchedule,
};
