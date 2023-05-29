const express = require('express');
const notificationUserController = require('./notification_user.controller');
const notificationUserValidation = require('./notification_user.validation');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { staffPermission } = require('../middlewares/staffPermission');
const { STAFF_ROLES } = require('../staff/staff.constant');

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
router.post('/test', validate(notificationUserValidation.testNotification), notificationUserController.testNotification);

router.get('/list', validate(notificationUserValidation.listNotification), notificationUserController.listNotification);
router.post(
  '/mark-read',
  validate(notificationUserValidation.markReadNotification),
  notificationUserController.markReadNotification
);
router.get('/count-unread', notificationUserController.countUnReadNotification);

// -------------------------------- ADMIN ROUTE ------------------------------------
router.post(
  '/create',
  staffPermission([STAFF_ROLES.ADMIN]),
  validate(notificationUserValidation.createNotification),
  notificationUserController.createNotification
);

module.exports = router;
