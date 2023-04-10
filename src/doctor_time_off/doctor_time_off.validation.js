const Joi = require('joi');

const list = {
  query: Joi.object().keys({
    id_doctor: Joi.string().uuid().required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
  }),
};

module.exports = {
  list,
};
