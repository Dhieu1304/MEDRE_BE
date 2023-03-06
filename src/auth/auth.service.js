const config = require('../config');
const moment = require('moment');
const { TOKEN_TYPES } = require('./auth.constant');
const jwt = require('jsonwebtoken');
const userService = require('../user/user.service');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const staffService = require('../staff/staff.service');

const generateToken = (user, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: user.id,
    email: user.email,
    phone_number: user.phone_number,
    role: user.role || 'user',
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const comparePassword = async (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user, accessTokenExpires, TOKEN_TYPES.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user, refreshTokenExpires, TOKEN_TYPES.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const loginUserWithPhoneNumberAndPassword = async (phone_number, password) => {
  // check user
  const user = await userService.findOneByFilter({ phone_number });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect phone number');
  }

  // check password
  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  return user;
};

const loginUserWithEmailAndPassword = async (email, password) => {
  // check user
  const user = await userService.findOneByFilter({ email });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email');
  }

  // check password
  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  return user;
};

const adminLoginUserWithEmailAndPassword = async (email, password) => {
  // check staff
  const staff = await staffService.findOneByFilter({ email });
  if (!staff) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email');
  }

  // check password
  const isPasswordMatch = await comparePassword(password, staff.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  return staff;
};

const refreshAuth = async (refresh_token) => {
  const user = await userService.findOneByFilter({ refresh_token });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect refresh token');
  }
  return generateAuthTokens(user);
};

module.exports = {
  generateAuthTokens,
  loginUserWithPhoneNumberAndPassword,
  loginUserWithEmailAndPassword,
  refreshAuth,
  comparePassword,

  // admin
  adminLoginUserWithEmailAndPassword,
};
