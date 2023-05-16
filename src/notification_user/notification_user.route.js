const express = require('express');
const notificationUserController = require('./notification_user.controller');
const notificationUserValidation = require('./notification_user.validation');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();
router.use(auth());

router.post(
  '/subscribe-topic',
  validate(notificationUserValidation.subscribeTopic),
  notificationUserController.subscribeTopic
);
router.post(
  '/un-subscribe-topic',
  validate(notificationUserValidation.subscribeTopic),
  notificationUserController.unSubscribeTopic
);
router.get('/test', validate(notificationUserValidation.testNotification), notificationUserController.testNotification);

module.exports = router;
