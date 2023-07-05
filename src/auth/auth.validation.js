const Joi = require('joi');
const { password } = require('../utils/validateCustom');
const { GENDERS } = require('../user/user.constant');
const { ACCOUNT_TYPES } = require('./auth.constant');
const { phoneNumberFormat, emailFormat } = require('../utils/messageCustom');

const register = {
  body: Joi.object().keys({
    phone_number: Joi.string().custom(phoneNumberFormat).trim(),
    email: Joi.string().custom(emailFormat).lowercase().trim(),
    password: Joi.string().required().trim().custom(password),
    name: Joi.string().trim(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    dob: Joi.date(),
    address: Joi.string().trim(),
  }),
};

const loginByEmail = {
  body: Joi.object().keys({
    email: Joi.string().required().custom(emailFormat).lowercase(),
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
    email: Joi.string().custom(emailFormat).lowercase().required(),
    type: Joi.number()
      .required()
      .valid(...Object.values(ACCOUNT_TYPES)),
  }),
};

const verifyOTP = {
  body: Joi.object().keys({
    phone_number: Joi.string().custom(phoneNumberFormat).trim(),
    type: Joi.number()
      .required()
      .valid(...Object.values(ACCOUNT_TYPES)),
  }),
};

const getDataLoginGoogle = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

module.exports = {
  register,
  loginByEmail,
  loginByPhoneNumber,
  loginByUsername,
  refreshTokens,
  resendMail,
  verifyOTP,
  getDataLoginGoogle,
};
