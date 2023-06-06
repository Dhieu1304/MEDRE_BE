const config = require('../config');
const https = require('https');
const { getMessaging } = require('firebase-admin/messaging');
const firebaseAdmin = require('../config/firebaseAdmin');
const models = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const { NOTIFICATION_FOR } = require('../notification/notification.constant');
const logger = require('../config/logger');
const _ = require('lodash');

const sendPushNotification = (data, callback) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: 'Basic ' + config.one_signal.api_key,
  };
  const options = {
    host: 'onesignal.com',
    port: 443,
    path: '/api/v1/notifications',
    method: 'POST',
    headers: headers,
  };

  const req = https.request(options, function (res) {
    res.on('data', function (data) {
      console.log(JSON.parse(data));
      return callback(null, JSON.parse(data));
    });
  });

  req.on('error', function (e) {
    return callback({ message: e });
  });

  req.write(JSON.stringify(data));
  req.end();
};

const sendNotificationTopicFCM = async (topic, payload) => {
  payload.notification = _.omitBy(payload.notification, _.isNil);
  return await firebaseAdmin.messaging().sendToTopic(topic, payload);
};

const subscribeTopic = async (registrationToken, topic) => {
  return await getMessaging().subscribeToTopic(registrationToken, topic);
};

const unSubscribeTopic = async (registrationToken, topic) => {
  return await getMessaging().unsubscribeFromTopic(registrationToken, topic);
};

const findAndCountAllByCondition = async (condition) => {
  return await models.notification_user.findAndCountAll(condition);
};

const createUserNotification = async (tableName, id_notification, filter = {}) => {
  const result = [];
  const listAccountId = await models[tableName].findAll({ where: filter, attributes: ['id'], raw: true });
  for (let i = 0; i < listAccountId.length; i++) {
    result.push({
      id: uuidv4(),
      id_notification,
      [`id_${tableName}`]: listAccountId[i].id,
    });
  }
  return result;
};

const createNotification = async (data, notificationUser) => {
  const transaction = await models.sequelize.transaction();
  let notificationForUser;
  try {
    data.id = uuidv4();
    const notification = await models.notification.create(data, { transaction });
    switch (data.notification_for) {
      case NOTIFICATION_FOR.PERSONAL: {
        notificationForUser = await models.notification_user.create(
          {
            id: uuidv4(),
            id_notification: notification.id,
            ...notificationUser, // id_user, id_staff
          },
          { transaction }
        );
        break;
      }
      case NOTIFICATION_FOR.USER: {
        const userNotificationData = await createUserNotification('user', notification.id);
        notificationForUser = await models.notification_user.bulkCreate(userNotificationData, { transaction });
        break;
      }
      case NOTIFICATION_FOR.STAFF: {
        const staffNotificationData = await createUserNotification('staff', notification.id);
        notificationForUser = await models.notification_user.bulkCreate(staffNotificationData, { transaction });
        break;
      }
      case NOTIFICATION_FOR.ALL_SYSTEM: {
        const allNotificationDataUser = await createUserNotification('user', notification.id);
        const allNotificationDataStaff = await createUserNotification('staff', notification.id);
        notificationForUser = await models.notification_user.bulkCreate(
          [...allNotificationDataUser, ...allNotificationDataStaff],
          {
            transaction,
          }
        );
        break;
      }
      default: {
        const staffRoleNotification = await createUserNotification('staff', notification.id, {
          role: data.notification_for,
        });
        notificationForUser = await models.notification_user.bulkCreate(staffRoleNotification, { transaction });
        break;
      }
    }

    await transaction.commit();
    return { notification, notificationUser: notificationForUser };
  } catch (e) {
    await transaction.rollback();
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
  }
};

const markReadNotification = async (filter) => {
  const userNotification = await models.notification_user.findOne({ where: filter });
  if (!userNotification) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid notification');
  }
  userNotification.read = true;
  return await userNotification.save();
};

const countByCondition = async (condition) => {
  return await models.notification_user.count(condition);
};

// data: { id_notification, notification_for }
const createNotificationUser = async (data, notificationUser) => {
  try {
    switch (data.notification_for) {
      case NOTIFICATION_FOR.PERSONAL: {
        await models.notification_user.create({
          id: uuidv4(),
          id_notification: data.id_notification,
          ...notificationUser, // id_user, id_staff
        });
        break;
      }
      case NOTIFICATION_FOR.USER: {
        const userNotificationData = await createUserNotification('user', data.id_notification);
        await models.notification_user.bulkCreate(userNotificationData);
        break;
      }
      case NOTIFICATION_FOR.STAFF: {
        const staffNotificationData = await createUserNotification('staff', data.id_notification);
        await models.notification_user.bulkCreate(staffNotificationData);
        break;
      }
      case NOTIFICATION_FOR.ALL_SYSTEM: {
        const allNotificationDataUser = await createUserNotification('user', data.id_notification);
        const allNotificationDataStaff = await createUserNotification('staff', data.id_notification);
        await models.notification_user.bulkCreate([...allNotificationDataUser, ...allNotificationDataStaff]);
        break;
      }
      default: {
        const staffRoleNotification = await createUserNotification('staff', data.id_notification, {
          role: data.notification_for,
        });
        await models.notification_user.bulkCreate(staffRoleNotification);
        break;
      }
    }
  } catch (e) {
    logger.error('Error create notification user', e.message);
  }
};

const findOneByCondition = async (condition) => {
  return await models.notification_user.findOne(condition);
};

module.exports = {
  sendPushNotification,
  sendNotificationTopicFCM,
  subscribeTopic,
  unSubscribeTopic,
  findAndCountAllByCondition,
  createNotification,
  markReadNotification,
  countByCondition,
  createNotificationUser,
  findOneByCondition,
};
