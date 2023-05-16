const Joi = require('joi');

const testNotification = {
  body: Joi.object().keys({
    title: Joi.string().required().trim(),
    content: Joi.string().required().trim(),
  }),
};

const subscribeTopic = {
  body: Joi.object().keys({
    registrationToken: Joi.string().required().trim(),
  }),
};

module.exports = {
  testNotification,
  subscribeTopic,
};
