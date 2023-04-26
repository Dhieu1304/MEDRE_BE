const express = require('express');
const mobileNotificationController = require('./mobile_notification.controller');

const router = express.Router();
//router.use(auth());

router.get('/all', mobileNotificationController.sendPushNotification)

module.exports = router;