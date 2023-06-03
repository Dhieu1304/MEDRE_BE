const Joi = require('joi');

const createPaymentUrl = {
  body: Joi.object().keys({
    id_booking: Joi.string().uuid().required(),
    language: Joi.string().valid('vn', 'en').default('vn'),
    bankCode: Joi.string().valid('VNPAYQR', 'VNBANK', 'INTCARD'), // no value = choose
  }),
};
const cashPayment = {
  body: Joi.object().keys({
    id_booking: Joi.string().uuid().required(),
  }),
};

module.exports = {
  createPaymentUrl,
  cashPayment,
};
