const Joi = require('joi');
const { NOTIFICATION_TYPE, NOTIFICATION_FOR } = require('../notification/notification.constant');
const { phoneNumberFormat } = require('../utils/messageCustom');

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

const createNotification = {
  body: Joi.object().keys({
    type: Joi.string()
      .valid(...Object.values(NOTIFICATION_TYPE))
      .required(),
    notification_for: Joi.string()
      .valid(...Object.values(NOTIFICATION_FOR))
      .required(),
    email_user: Joi.string().email().lowercase().trim(),
    email_staff: Joi.string().email().lowercase().trim(),
    phone_number_user: Joi.string().custom(phoneNumberFormat).trim(),
    phone_number_staff: Joi.string().custom(phoneNumberFormat).trim(),
    id_user: Joi.string().uuid(),
    id_staff: Joi.string().uuid(),
    title: Joi.string().trim().required(),
    content: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    id_redirect: Joi.string().uuid(),
  }),
};

const markReadNotification = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

const detailNotification = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

module.exports = {
  testNotification,
  subscribeTopic,
  listNotification,
  createNotification,
  markReadNotification,
  detailNotification,
};
