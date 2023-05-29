const Joi = require('joi');

const list = {
  query: Joi.object().keys({
    is_apply: Joi.boolean().default(true),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

module.exports = {
  list,
};
