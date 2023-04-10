const Joi = require('joi');
const { GENDERS } = require('../user/user.constant');
const {phoneNumberRegex} = require("../utils/validateCustom");
const { password } = require('../utils/validateCustom');

const editUser = {
  body: Joi.object().keys({
    phone_number: Joi.string().regex(phoneNumberRegex).message('Invalid phone number format'),
    email: Joi.string(),
    name: Joi.string(),
    image: Joi.string(),
    address: Joi.string(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    dob: Joi.date(),
    health_insurance: Joi.string(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    old_password: Joi.string().required(),
    new_password: Joi.string().required().custom(password),
    confirm_password: Joi.string().required(),
  }),
};


module.exports = {
  // admin
  editUser,
  changePassword,
};
