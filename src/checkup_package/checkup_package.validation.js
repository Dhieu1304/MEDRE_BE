const Joi = require('joi');

const updateCheckupPackage = {
  body: Joi.object().keys({
    id_expertise: Joi.string().uuid(),
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number().integer(),
  }),
};

const createPackage = {
  body: Joi.object().keys({
    id_expertise: Joi.string().uuid().required(),
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().integer().required(),
  }),
};

const deletePackage = {
  query: Joi.object().keys({
    id_checkup_package: Joi.string().uuid().required(),
  }),
};

const listCheckupPackage = {
  query: Joi.object().keys({
    id_expertise: Joi.string().uuid(),
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number().integer(),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

module.exports = {
  updateCheckupPackage,
  createPackage,
  deletePackage,
  listCheckupPackage,
};
