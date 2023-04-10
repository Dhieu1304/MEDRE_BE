const Joi = require('joi');
const { password, phoneNumberRegex} = require('../utils/validateCustom');
const { GENDERS } = require('../user/user.constant');

const register = {
  body: Joi.object().keys({
    phone_number: Joi.string().required().regex(phoneNumberRegex).message('Invalid phone number format'),
    email: Joi.string().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    dob: Joi.date(),
    address: Joi.string(),
  }),
};

const loginByEmail = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const loginByPhoneNumber = {
  body: Joi.object().keys({
    phone_number: Joi.string().required().regex(phoneNumberRegex).message('Invalid phone number format'),
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

module.exports = {
  register,
  loginByEmail,
  loginByPhoneNumber,
  loginByUsername,
  refreshTokens,
};
