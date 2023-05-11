const Joi = require('joi');
const moment = require('moment');
const { SCHEDULE_SESSION } = require('../schedule/schedule.constant');

const list = {
  query: Joi.object().keys({
    id_doctor: Joi.string().uuid(),
    from: Joi.date().default(moment()),
    to: Joi.date().default(moment()),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

const createTimeOff = {
  body: Joi.object().keys({
    from: Joi.date().required(),
    to: Joi.date().required(),
    session: Joi.string()
      .required()
      .valid(...Object.values(SCHEDULE_SESSION)),
  }),
};

const editTimeOff = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    from: Joi.date(),
    to: Joi.date(),
    session: Joi.string().valid(...Object.values(SCHEDULE_SESSION)),
  }),
};

const deleteTimeOff = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

module.exports = {
  list,
  createTimeOff,
  editTimeOff,
  deleteTimeOff,
};
