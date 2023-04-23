const Joi = require('joi');
const { timeScheduleFormat } = require('../utils/messageCustom');

const list = {
  query: Joi.object().keys({
    id_doctor: Joi.string().uuid(),
    from: Joi.date().default(new Date()),
    to: Joi.date().default(new Date()),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

const createTimeOff = {
  body: Joi.object().keys({
    from: Joi.date().required(),
    to: Joi.date().required(),
    time_start: Joi.string().required().custom(timeScheduleFormat),
    time_end: Joi.string().required().custom(timeScheduleFormat),
  }),
};

module.exports = {
  list,
  createTimeOff,
};
