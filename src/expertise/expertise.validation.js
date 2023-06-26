const Joi = require('joi');

const createExpertise = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    price_offline: Joi.number().integer().min(0).required(),
    price_online: Joi.number().integer().min(0).required(),
  }),
};

const updateExpertise = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    name: Joi.string().required(),
    price_offline: Joi.number().integer().min(0),
    price_online: Joi.number().integer().min(0),
  }),
};

const deleteExpertise = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
  }),
};

module.exports = {
  createExpertise,
  deleteExpertise,
  updateExpertise,
};
