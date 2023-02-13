const Joi = require('joi');
const { password } = require('../utils/validateCustom');
const { GENDERS } = require('../user/user.constant');

const register = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
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
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  register,
  loginByEmail,
  loginByPhoneNumber,
  refreshTokens,
};
