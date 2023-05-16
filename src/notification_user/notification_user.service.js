const config = require('../config');
const https = require('https');
const { getMessaging } = require('firebase-admin/messaging');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { NOTIFICATION_FOR } = require('../notification/notification.constant');
const firebaseAdmin = require('../config/firebaseAdmin');

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
  firebaseAdmin
    .messaging()
    .sendToTopic(topic, payload)
    .catch((error) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    });
};

const subscribeTopic = async (registrationToken, user) => {
  getMessaging()
    .subscribeToTopic([registrationToken], user.id)
    .catch((error) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    });
  getMessaging()
    .subscribeToTopic([registrationToken], user.role)
    .catch((error) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    });
  getMessaging()
    .subscribeToTopic([registrationToken], NOTIFICATION_FOR.ALL_SYSTEM)
    .catch((error) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    });
};

const unSubscribeTopic = async (registrationToken, user) => {
  getMessaging()
    .unsubscribeFromTopic([registrationToken], user.id)
    .catch((error) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    });
  getMessaging()
    .unsubscribeFromTopic([registrationToken], user.role)
    .catch((error) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    });
  getMessaging()
    .unsubscribeFromTopic([registrationToken], NOTIFICATION_FOR.ALL_SYSTEM)
    .catch((error) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    });
};

module.exports = {
  sendPushNotification,
  sendNotificationTopicFCM,
  subscribeTopic,
  unSubscribeTopic,
};
