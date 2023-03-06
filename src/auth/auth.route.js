const express = require('express');
const validate = require('../middlewares/validate');
const authValidation = require('./auth.validation');
const authController = require('./auth.controller');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login-by-email', validate(authValidation.loginByEmail), authController.loginEmailPassword);
router.post('/login-by-phone-number', validate(authValidation.loginByPhoneNumber), authController.loginPhonePassword);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

// -------------------------------- ADMIN ROUTE ------------------------------------
router.post('/admin/login-by-email', validate(authValidation.loginByEmail), authController.adminLoginEmailPassword);

module.exports = router;
