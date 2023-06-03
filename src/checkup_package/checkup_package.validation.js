const Joi = require('joi');

const updateCheckupPackage = {
  body: Joi.object().keys({
    id_expertise: Joi.string().uuid(),
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number().integer(),
  }),
};

const createCheckupPackage = {
  body: Joi.object().keys({
    id_expertise: Joi.string().uuid().required(),
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().integer().required(),
  }),
};

const listCheckupPackage = {
  query: Joi.object().keys({
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

module.exports = {
  updateCheckupPackage,
  createCheckupPackage,
  listCheckupPackage,
};
