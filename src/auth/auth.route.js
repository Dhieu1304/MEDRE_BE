const express = require('express');
const validate = require('../middlewares/validate');
const authValidation = require('./auth.validation');
const authController = require('./auth.controller');
const { authLimiter } = require('../middlewares/rateLimit');

const router = express.Router();
router.use(authLimiter);

router.post('/register', validate(authValidation.register), authController.register);
router.get('/verify/:token', authController.verifySuccess);
router.post('/login-by-email', validate(authValidation.loginByEmail), authController.loginEmailPassword);
router.post('/login-by-phone-number', validate(authValidation.loginByPhoneNumber), authController.loginPhonePassword);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

// -------------------------------- STAFF ROUTE ------------------------------------
router.post('/staff/login-by-email', validate(authValidation.loginByEmail), authController.staffLoginEmailPassword);
router.post(
  '/staff/login-by-phone-number',
  validate(authValidation.loginByPhoneNumber),
  authController.staffLoginPhonePassword
);
router.post('/staff/login-by-username', validate(authValidation.loginByUsername), authController.staffLoginUsernamePassword);
router.post('/staff/refresh-tokens', validate(authValidation.refreshTokens), authController.staffRefreshTokens);

module.exports = router;
