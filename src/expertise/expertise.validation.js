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

module.exports = {
  createExpertise,
  updateExpertise,
};
