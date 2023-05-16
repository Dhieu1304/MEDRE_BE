const config = require('../config');
const https = require('https');
const { getMessaging } = require('firebase-admin/messaging');
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
  return await firebaseAdmin.messaging().sendToTopic(topic, payload);
};

const subscribeTopic = async (registrationToken, topic) => {
  return await getMessaging().subscribeToTopic(registrationToken, topic);
};

const unSubscribeTopic = async (registrationToken, topic) => {
  return await getMessaging().unsubscribeFromTopic(registrationToken, topic);
};

module.exports = {
  sendPushNotification,
  sendNotificationTopicFCM,
  subscribeTopic,
  unSubscribeTopic,
};
