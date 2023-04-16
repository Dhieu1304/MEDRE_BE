const Joi = require('joi');

const createPaymentUrl = {
  body: Joi.object().keys({
    booking_id: Joi.string().uuid().required(),
    language: Joi.string().valid('vn', 'en').default('vn'),
    bankCode: Joi.string().valid('VNPAYQR', 'VNBANK', 'INTCARD'), // no value = choose
  }),
};

module.exports = {
  createPaymentUrl,
};
