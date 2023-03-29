const Joi = require('joi');
const { GENDERS } = require('../user/user.constant');

const editUser = {
  body: Joi.object().keys({
    phone_number: Joi.string(),
    email: Joi.string(),
    name: Joi.string(),
    image: Joi.string(),
    address: Joi.string(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    dob: Joi.date(),
    health_insurance: Joi.string(),
  }),
};

module.exports = {
  // admin
  editUser,
};
