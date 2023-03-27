const Joi = require('joi');

const listByDay = {
  query: Joi.object().keys({
    id_doctor: Joi.string().uuid().required(),
    date: Joi.date().required(),
  }),
};

const listFromTo = {
  query: Joi.object().keys({
    id_doctor: Joi.string().uuid().required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
  }),
};

module.exports = {
  listByDay,
  listFromTo,
};
