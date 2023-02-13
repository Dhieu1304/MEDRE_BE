const config = require('../../config');
const moment = require('moment');
const { TOKEN_TYPES } = require('./auth.constant');
const jwt = require('jsonwebtoken');
const { userService, historyLoginService } = require('../services.init');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const generateToken = (user, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: user._id,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
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

const loginUserWithPhoneNumberAndPassword = async (phoneNumber, password) => {
  const user = await userService.findOneByFilter({ phoneNumber });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.findOneByFilter({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await historyLoginService.verifyToken(refreshToken);
    const user = await userService.findOneByFilter({ _id: refreshTokenDoc.userId });
    return generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

module.exports = {
  generateAuthTokens,
  loginUserWithPhoneNumberAndPassword,
  loginUserWithEmailAndPassword,
  refreshAuth,
};
