const express = require('express');
const validate = require('../middlewares/validate');
const paymentController = require('./payment.controller');
const paymentValidation = require('./payment.validation');
const auth = require('../middlewares/auth');
const getIpAddress = require('../middlewares/ipAddr');
const { rateLimiter } = require('../middlewares/rateLimit');

const router = express.Router();

router.post(
  '/create',
  auth(),
  getIpAddress(),
  rateLimiter(1, 1),
  validate(paymentValidation.createPaymentUrl),
  paymentController.createPaymentUrl
);
router.get('/vnpay-return', paymentController.returnData);

module.exports = router;
