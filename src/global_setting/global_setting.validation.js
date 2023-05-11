const Joi = require('joi');

const editSetting = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    value: Joi.string().required().trim(),
  }),
};

module.exports = {
  editSetting,
};
