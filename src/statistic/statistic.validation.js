const Joi = require('joi');
const { STATISTIC_TIME } = require('./statistic.constant');

const statisticBy = {
  query: Joi.object().keys({
    time: Joi.string()
      .valid(...Object.values(STATISTIC_TIME))
      .default(STATISTIC_TIME.DAY),
  }),
};

module.exports = {
  statisticBy,
};
