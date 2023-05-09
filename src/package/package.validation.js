const Joi = require('joi');

const getPrice = {
  query: Joi.object().keys({
    id_schedule: Joi.string().uuid().required(),
  }),
};

const updatePrice = {
  query: Joi.object().keys({
    id_package: Joi.string().uuid().required(),
    price: Joi.number().integer().required(),
  }),
};

const getAllPackage = {
  query: Joi.object().keys({
    id_expertise: Joi.string().uuid().required(),
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
    id_package: Joi.string().uuid().required(),
  }),
};

module.exports = {
  getPrice,
  updatePrice,
  getAllPackage,
  createPackage,
  deletePackage,
};
