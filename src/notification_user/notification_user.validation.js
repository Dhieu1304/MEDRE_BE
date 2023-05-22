const Joi = require('joi');
const {NOTIFICATION_TYPE} = require("../notification/notification.constant");

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

const listNotification = {
  query: Joi.object().keys({
    type: Joi.string().valid(...Object.values(NOTIFICATION_TYPE)),
    read: Joi.boolean(),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

module.exports = {
  testNotification,
  subscribeTopic,
  listNotification,
};
