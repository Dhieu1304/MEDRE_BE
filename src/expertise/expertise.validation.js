const Joi = require('joi');

const getAllExpertise = {
  query: Joi.object().keys({
    name: Joi.string(),
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
  }),
};

const createExpertise = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateExpertise = {
  body: Joi.object().keys({
    old_name: Joi.string().required(),
    new_name: Joi.string().required(),
  }),
};

module.exports = {
  getAllExpertise,
  createExpertise,
  updateExpertise,
};
