const express = require('express');
const validate = require('../middlewares/validate');
const paymentController = require('./payment.controller');
const paymentValidation = require('./payment.validation');

const router = express.Router();

router.post('/create', validate(paymentValidation.createPaymentUrl), paymentController.createPaymentUrl);
router.get('/vnpay-return', paymentController.returnData);

module.exports = router;
