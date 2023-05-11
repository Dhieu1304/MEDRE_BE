const Joi = require('joi');
const { SCHEDULE_TYPE, SCHEDULE_SESSION } = require('./schedule.constant');
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
    data: Joi.array()
      .items(
        Joi.object().keys({
          id_expertise: Joi.string().uuid().required(),
          type: Joi.string()
            .valid(...Object.values(SCHEDULE_TYPE))
            .required(),
          session: Joi.string()
            .valid(...Object.values(SCHEDULE_SESSION))
            .required(),
          repeat_on: Joi.array().items(Joi.number().integer().min(0).max(6).required()),
        })
      )
      .required(),
    id_doctor: Joi.string().uuid().required(),
    apply_from: Joi.date().default(moment()),
    apply_to: Joi.date().default(moment().add(1, 'years')),
  }),
};

const changeApplyToAll = {
  body: Joi.object().keys({
    id_doctor: Joi.string().uuid().required(),
    apply_to: Joi.date().required(),
  }),
};

const changeApplyTo = {
  body: Joi.object().keys({
    id: Joi.array().items(Joi.string().uuid().required()).required(),
    apply_to: Joi.date().required(),
  }),
};

const deleteSchedule = {
  body: Joi.object().keys({
    id: Joi.array().items(Joi.string().uuid().required()).required(),
  }),
};

module.exports = {
  listByDay,
  listAll,
  createSchedule,
  changeApplyToAll,
  changeApplyTo,
  deleteSchedule,
};
