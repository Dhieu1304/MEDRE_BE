const Joi = require('joi');

const getList = {
  query: Joi.object().keys({
    id_expertise: Joi.string().uuid(),
    id_time_schedule: Joi.string().uuid(),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(20).min(1),
  }),
};

module.exports = {
  getList,
};
