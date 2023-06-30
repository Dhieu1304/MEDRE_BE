const Joi = require('joi');
const { STATISTIC_TIME } = require('./statistic.constant');
const moment = require('moment');

const statisticBy = {
  query: Joi.object().keys({
    time: Joi.string()
      .valid(...Object.values(STATISTIC_TIME))
      .default(STATISTIC_TIME.DAY),
    from: Joi.date().required(),
    to: Joi.date().default(moment()),
  }),
};

const statisticRevenue = {
  query: Joi.object().keys({
    time: Joi.string()
      .valid(...Object.values(STATISTIC_TIME))
      .default(STATISTIC_TIME.DAY),
    from: Joi.date().required(),
    to: Joi.date().default(moment()),
  }),
};

module.exports = {
  statisticBy,
  statisticRevenue,
};
