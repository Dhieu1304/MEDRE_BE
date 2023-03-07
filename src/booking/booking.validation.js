const Joi = require('joi');

const booking = {
  body: Joi.object().keys({
    id_schedule: Joi.string().uuid().required(),
    reason: Joi.string().required(),
    id_patient: Joi.string().uuid().required(),
  }),
};

module.exports = {
  booking,
};
