const Joi = require('joi');
const { STATISTIC_TIME } = require('./statistic.constant');
const { SCHEDULE_TYPE } = require('../schedule/schedule.constant');

const statisticBy = {
  query: Joi.object().keys({
    time: Joi.string()
      .valid(...Object.values(STATISTIC_TIME))
      .default(STATISTIC_TIME.DAY),
  }),
};

const statisticRevenue = {
  query: Joi.object().keys({
    time: Joi.string()
      .valid(...Object.values(STATISTIC_TIME))
      .default(STATISTIC_TIME.DAY),
    type: Joi.string()
      .valid(...Object.values(SCHEDULE_TYPE))
      .default(SCHEDULE_TYPE.OFFLINE),
  }),
};

module.exports = {
  statisticBy,
  statisticRevenue,
};
