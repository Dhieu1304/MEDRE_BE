const express = require('express');
const passport = require('passport');
const validate = require('../middlewares/validate');
const authValidation = require('./auth.validation');
const authController = require('./auth.controller');
// const { authLimiter } = require('../middlewares/rateLimit');

const router = express.Router();
// router.use(authLimiter);

router.post('/register', validate(authValidation.register), authController.register);
router.get('/verify/:token', authController.verifySuccess);
router.post('/verify/otp', validate(authValidation.verifyOTP), authController.verifyOTPSuccess);
router.post('/verify/resend-mail', validate(authValidation.resendMail), authController.resendMail);
router.post('/login-by-email', validate(authValidation.loginByEmail), authController.loginEmailPassword);
router.post('/login-by-phone-number', validate(authValidation.loginByPhoneNumber), authController.loginPhonePassword);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/reset-password/send-mail', validate(authValidation.resendMail), authController.sendResetPasswordMail);
router.get('/reset-password/:token', authController.resetPasswordForm);
router.post('/reset-password/:token', authController.resetPassword);

// -------------------------------- STAFF ROUTE ------------------------------------
router.post('/staff/login-by-email', validate(authValidation.loginByEmail), authController.staffLoginEmailPassword);
router.post(
  '/staff/login-by-phone-number',
  validate(authValidation.loginByPhoneNumber),
  authController.staffLoginPhonePassword
);
router.post('/staff/login-by-username', validate(authValidation.loginByUsername), authController.staffLoginUsernamePassword);
router.post('/staff/refresh-tokens', validate(authValidation.refreshTokens), authController.staffRefreshTokens);

// Oauth
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/google/failure',
  }),
  (req, res) => {
    res.redirect(`http://localhost:3456?id=${req.user.id}`);
  }
);
router.get('/google/failure', authController.failureLoginGoogle);
router.get('/google/data/:id', validate(authValidation.getDataLoginGoogle), authController.getDataLoginGoogle);

module.exports = router;
