const Joi = require('joi');

const createExpertise = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
  }),
};

const updateExpertise = {
  body: Joi.object().keys({
    old_name: Joi.string().required(),
    new_name: Joi.string().required(),
  }),
};

const updatePrice = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    price_offline: Joi.number().integer().min(0),
    price_online: Joi.number().integer().min(0),
  }),
};

module.exports = {
  createExpertise,
  updateExpertise,
  updatePrice,
};
