const config = require('../config');
const moment = require('moment');
const { TOKEN_TYPES } = require('./auth.constant');
const jwt = require('jsonwebtoken');
const userService = require('../user/user.service');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const staffService = require('../staff/staff.service');
const i18next = require('i18next');
const nodemailer = require('nodemailer');
const logger = require('../config/logger');

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
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('phoneNumber.phoneIncorrect'));
  }

  // check password
  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('password.passwordIncorrect'));
  }

  // check verify phone number
  if (!user.phone_verified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('account.verifyPhoneNumber'));
  }

  if (user.blocked) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('block.blockAccount'));
  }

  return user;
};

const staffLoginUserWithPhoneNumberAndPassword = async (phone_number, password) => {
  // check user
  const staff = await staffService.findOneByFilter({ phone_number });
  if (!staff) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('phoneNumber.phoneIncorrect'));
  }

  // check password
  const isPasswordMatch = await comparePassword(password, staff.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('password.passwordIncorrect'));
  }

  // check verify phone number
  if (!staff.phone_verified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('account.verifyPhoneNumber'));
  }

  if (staff.blocked) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('block.blockAccount'));
  }

  return staff;
};

const loginUserWithEmailAndPassword = async (email, password) => {
  // check user
  const user = await userService.findOneByFilter({ email });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('email.emailIncorrect'));
  }

  // check password
  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('password.passwordIncorrect'));
  }

  // check verify email
  if (!user.email_verified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('account.verifyEmail'));
  }

  if (user.blocked) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('block.blockAccount'));
  }

  return user;
};

const staffLoginUserWithEmailAndPassword = async (email, password) => {
  // check staff
  const staff = await staffService.findOneByFilter({ email });
  if (!staff) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('email.emailIncorrect'));
  }

  // check password
  const isPasswordMatch = await comparePassword(password, staff.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('password.passwordIncorrect'));
  }

  // check verify email
  if (!staff.email_verified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('account.verifyEmail'));
  }

  if (staff.blocked) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('block.blockAccount'));
  }

  return staff;
};

const staffLoginUserWithUsernameAndPassword = async (username, password) => {
  // check staff
  const staff = await staffService.findOneByFilter({ username });
  if (!staff) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('username.usernameInccorect'));
  }

  // check password
  const isPasswordMatch = await comparePassword(password, staff.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('password.passwordIncorrect'));
  }

  if (staff.blocked) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('block.blockAccount'));
  }

  return staff;
};

const refreshAuth = async (refresh_token) => {
  const user = await userService.findOneByFilter({ refresh_token });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('refreshToken.refreshTokenIncorrect'));
  }
  const tokens = await generateAuthTokens(user);
  user.refresh_token = tokens.refresh.token;
  await user.save();
  return { user, tokens };
};

const staffRefreshAuth = async (refresh_token) => {
  const staff = await staffService.findOneByFilter({ refresh_token });
  if (!staff) {
    throw new ApiError(httpStatus.UNAUTHORIZED, i18next.t('refreshToken.refreshTokenIncorrect'));
  }
  const tokens = await generateAuthTokens(staff);
  staff.refresh_token = tokens.refresh.token;
  await staff.save();
  return { staff, tokens };
};

const verificationEmailTemplate = (link) => {
  return `
	    <!DOCTYPE html>
        <html>
            <head>
			    <meta charset="UTF-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<style>
					h1{
						font-size: 20px;
						padding: 5px;
					}
				</style>
			</head>
			<body>
					<div>
						<div style="max-width: 620px; margin:0 auto; font-family:sans-serif;color:#272727;background: #f6f6f6">
							<h1 style="padding:10px;text-align:center;color:#272727;">
							${i18next.t('verifyMailTemplate.header')}
							</h1>
							<p style="text-align:center;">${i18next.t('verifyMailTemplate.verify')}</p>
							<div style="overflow: hidden;display: flex;justify-content: center;align-items: center;">
								<a href=${link} style="background: #0000D1; text-align:center;font-size:16px;margin:auto;padding:15px 30px; color:#ffffff; text-decoration:None;">${i18next.t(
    'verifyMailTemplate.button'
  )}</a>
							</div>
						</div> 
                    </div>
           </body>`;
};

const generateVerifyToken = (mail, secret = config.jwt.secret) => {
  return jwt.sign({ mail: mail }, secret, { expiresIn: config.jwt.verifyExpirationHours });
};

const sendMailVerification = async (email, type) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.nodemailer.nm_email,
        pass: config.nodemailer.nm_password,
      },
    });
    let token = generateVerifyToken(email);
    let url = config.base_url.be_url + '/auth/verify/' + token + type;
    const mailOptions = {
      from: config.nodemailer.nm_email,
      to: email,
      subject: i18next.t('verifyMailTemplate.subject'),
      html: verificationEmailTemplate(url),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error('Fail send mail: ' + error.message);
      } else {
        logger.info('Email sent successfully. Info: ' + info.response);
      }
    });
  } catch (error) {
    logger.error(error.message);
  }
};

const verifyEmail = async (token) => {
  try {
    const type = token[token.length - 1];
    const tk = token.substr(0, token.length - 1);
    const decoded = jwt.verify(tk, config.jwt.secret);
    if (type == 1) {
      const user = await userService.findOneByFilter({ email: decoded.mail });
      await user.update({ email_verified: true });
      return true;
    }
    if (type == 2) {
      const staff = await staffService.findOneByFilter({ email: decoded.mail });
      await staff.update({ email_verified: true });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error(error.message);
    //return false;
  }
};

const resetPassEmailTemplate = (link) => {
  return `
	    <!DOCTYPE html>
        <html>
            <head>
			    <meta charset="UTF-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<style>
					h1{
						font-size: 20px;
						padding: 5px;
					}
				</style>
			</head>
			<body>
					<div>
						<div style="max-width: 620px; margin:0 auto; font-family:sans-serif;color:#272727;background: #f6f6f6">
							<h1 style="padding:10px;text-align:center;color:#272727;">
							${i18next.t('resetMailTemplate.header')}
							</h1>
							<p style="text-align:center;">${i18next.t('resetMailTemplate.open')} </p>
							<div style="overflow: hidden;display: flex;justify-content: center;align-items: center;">
								<a href=${link} style="background: #0000D1; text-align:center;font-size:16px;margin:auto;padding:15px 30px; color:#ffffff; text-decoration:None;">${i18next.t(
    'resetMailTemplate.button'
  )}</a>
							</div>
							<br/>
							<p style="text-align:center;">${i18next.t('resetMailTemplate.warning1')}</p>
							<p style="text-align:center;">${i18next.t('resetMailTemplate.warning2')}</p>
						</div> 
                    </div>
           </body>`;
};

const sendMailResetPassword = async (email, type) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.nodemailer.nm_email,
        pass: config.nodemailer.nm_password,
      },
    });
    let token = generateVerifyToken(email);
    var url = '';
    if (type == 1) {
      url = config.base_url.fe_user_url + '/reset-password/' + token + type;
    } else if (type == 2) {
      url = config.base_url.fe_admin_url + '/reset-password/' + token + type;
    }
    const mailOptions = {
      from: config.nodemailer.nm_email,
      to: email,
      subject: i18next.t('resetMailTemplate.subject'),
      html: resetPassEmailTemplate(url),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error('Fail send mail: ' + error.message);
      } else {
        logger.info('Email sent successfully. Info: ' + info.response);
      }
    });
  } catch (error) {
    logger.error(error.message);
  }
};

const resetPassword = async (token, new_password, confirm_password) => {
  try {
    const type = token[token.length - 1];
    const tk = token.substr(0, token.length - 1);
    const decoded = jwt.verify(tk, config.jwt.secret);
    if (type == 1) {
      await userService.resetPassword(decoded.mail, new_password, confirm_password);
      return true;
    }
    if (type == 2) {
      await staffService.resetPassword(decoded.mail, new_password, confirm_password);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error(error.message);
    //return false;
  }
};

module.exports = {
  generateAuthTokens,
  loginUserWithPhoneNumberAndPassword,
  loginUserWithEmailAndPassword,
  refreshAuth,
  comparePassword,
  verificationEmailTemplate,
  sendMailVerification,
  verifyEmail,
  resetPassEmailTemplate,
  sendMailResetPassword,
  resetPassword,

  // admin
  staffLoginUserWithEmailAndPassword,
  staffLoginUserWithPhoneNumberAndPassword,
  staffLoginUserWithUsernameAndPassword,
  staffRefreshAuth,
};
