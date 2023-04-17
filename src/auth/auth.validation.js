const Joi = require('joi');
const { password } = require('../utils/validateCustom');
const { GENDERS } = require('../user/user.constant');
const { phoneNumberFormat } = require('../utils/messageCustom');

const register = {
  body: Joi.object().keys({
    phone_number: Joi.string().required().custom(phoneNumberFormat),
    email: Joi.string().email().lowercase(),
    password: Joi.string().required().custom(password),
    name: Joi.string().trim(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    dob: Joi.date(),
    address: Joi.string(),
  }),
};

const loginByEmail = {
  body: Joi.object().keys({
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required(),
  }),
};

const loginByPhoneNumber = {
  body: Joi.object().keys({
    phone_number: Joi.string().required().custom(phoneNumberFormat),
    password: Joi.string().required(),
  }),
};

const loginByUsername = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refresh_token: Joi.string().required(),
  }),
};

const resendMail = {
  body: Joi.object().keys({
    email: Joi.string().email().lowercase().required(),
  }),
};

module.exports = {
  register,
  loginByEmail,
  loginByPhoneNumber,
  loginByUsername,
  refreshTokens,
  resendMail,
};
