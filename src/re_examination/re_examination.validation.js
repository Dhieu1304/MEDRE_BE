const Joi = require('joi');

const list = {
  query: Joi.object().keys({
    is_apply: Joi.boolean().default(true),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

const create = {
  body: Joi.object().keys({
    id_booking: Joi.string().uuid().required(),
    date_re_exam: Joi.date().required(),
  }),
};

const update = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    is_apply: Joi.boolean(),
    date_re_exam: Joi.date(),
  }),
};

module.exports = {
  list,
  create,
  update,
};
