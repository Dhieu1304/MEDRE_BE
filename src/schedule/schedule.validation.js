const Joi = require('joi');
const { SCHEDULE_TYPE } = require('./schedule.constant');
const moment = require('moment');

const listByDay = {
  query: Joi.object().keys({
    id_doctor: Joi.string().uuid().required(),
    date: Joi.date().required(),
  }),
};

const listAll = {
  query: Joi.object().keys({
    id_doctor: Joi.string().uuid().required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
  }),
};

const createSchedule = {
  body: Joi.object().keys({
    data: Joi.array().items(
      Joi.object().keys({
        day_of_week: Joi.number().integer().min(0).max(6).required(),
        id_time: Joi.string().uuid().required(),
        type: Joi.string()
          .valid(...Object.values(SCHEDULE_TYPE))
          .default(SCHEDULE_TYPE.OFFLINE),
      })
    ),
    id_doctor: Joi.string().uuid().required(),
    apply_from: Joi.date().default(moment()),
    apply_to: Joi.date().default(moment().add(1, 'years')),
  }),
};

module.exports = {
  listByDay,
  listAll,
  createSchedule,
};
