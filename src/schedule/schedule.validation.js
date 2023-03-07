const Joi = require('joi');

const listByDay = {
  query: Joi.object().keys({
    id_doctor: Joi.string().uuid().required(),
    date: Joi.date().required(),
  }),
};

module.exports = {
  listByDay,
};
