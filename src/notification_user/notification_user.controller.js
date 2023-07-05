/*global _io*/
/*eslint no-undef: "error"*/
const config = require('../config');
const notificationUserService = require('./notification_user.service');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage, paginationFormat } = require('../utils/responseFormat');
const i18next = require('i18next');
const { NOTIFICATION_FOR } = require('../notification/notification.constant');
const pick = require('../utils/pick');
const pageLimit2Offset = require('../utils/pageLimit2Offset');
const models = require('../models');
const { NOTIFICATION_EVENT } = require('../socket/socket.constant');
const logger = require('../config/logger');
const userService = require('../user/user.service');
const { Op } = require('sequelize');
const staffService = require('../staff/staff.service');

const subscribeTopic = catchAsync(async (req, res) => {
  await notificationUserService.subscribeTopic(req.body.registrationToken, req.user.id);
  await notificationUserService.subscribeTopic(req.body.registrationToken, req.user.role);
  await notificationUserService.subscribeTopic(req.body.registrationToken, NOTIFICATION_FOR.ALL_SYSTEM);
  return res.status(httpStatus.OK).json(responseMessage(''));
});

const unSubscribeTopic = catchAsync(async (req, res) => {
  await notificationUserService.unSubscribeTopic(req.body.registrationToken, req.user.id);
  await notificationUserService.unSubscribeTopic(req.body.registrationToken, req.user.role);
  await notificationUserService.unSubscribeTopic(req.body.registrationToken, NOTIFICATION_FOR.ALL_SYSTEM);
  return res.status(httpStatus.OK).json(responseMessage(''));
});

const testNotification = catchAsync(async (req, res) => {
  const { title, content: body } = req.body;
  const payload = {
    notification: { title, body },
  };
  _io.in(req.user.id).emit(NOTIFICATION_EVENT.NOTIFICATION, payload);
  await notificationUserService.sendNotificationTopicFCM(req.user.id, payload);
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('notification.fcm')));
});

const listNotification = catchAsync(async (req, res) => {
  const filter = pick(req.param, ['type', 'read']);
  const { page, limit } = req.query;
  req.user.role === NOTIFICATION_FOR.USER ? (filter.id_user = req.user.id) : (filter.id_staff = req.user.id);
  filter.include;
  const condition = {
    where: filter,
    include: [{ model: models.notification, as: 'notifications_parent' }],
    ...pageLimit2Offset(page, limit),
    order: [['createdAt', 'desc']],
  };
  const listNotification = await notificationUserService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(listNotification, page, limit)));
});

const createNotification = catchAsync(async (req, res) => {
  const data = pick(req.body, ['type', 'notification_for', 'title', 'content', 'description', 'id_redirect']);
  const notificationUserData = pick(req.body, [
    'id_user',
    'id_staff',
    'email_user',
    'phone_number_user',
    'email_staff',
    'phone_number_staff',
  ]);
  data.created_by = req.user.id;
  let notificationUser = {};
  if (data.notification_for === NOTIFICATION_FOR.PERSONAL) {
    if (Object.keys(notificationUserData).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('notification.idRequired'), false));
    }
    if (notificationUserData.id_user || notificationUserData.id_staff) {
      notificationUser.id_user = notificationUserData.id_user;
      notificationUser.id_staff = notificationUserData.id_staff;
    } else if (notificationUserData.email_user || notificationUserData.phone_number_user) {
      const user = await userService.findOneByFilter({
        [Op.or]: [
          { email: notificationUserData.email_user || '' },
          { phone_number: notificationUserData.phone_number_user || '' },
        ],
      });
      if (!user) {
        return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('notification.invalid'), false));
      }
      notificationUser.id_user = user.id;
    } else if (notificationUserData.email_staff || notificationUserData.phone_number_staff) {
      const staff = await staffService.findOneByFilter({
        [Op.or]: [
          { email: notificationUserData.email_staff || '' },
          { phone_number: notificationUserData.phone_number_staff || '' },
        ],
      });
      if (!staff) {
        return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('notification.idRequired'), false));
      }
      notificationUser.id_staff = staff.id;
    }
  }
  await notificationUserService.createNotification(data, notificationUser);
  res.status(httpStatus.OK).json(responseMessage(i18next.t('notification.create')));

  try {
    // send notification
    const payload = {
      notification: {
        title: data.title,
        body: data.content,
        type: data.type,
        id_redirect: data.id_redirect,
      },
    };
    if (data.notification_for === NOTIFICATION_FOR.PERSONAL) {
      const idAccount = notificationUser.id_user || notificationUser.id_staff;
      _io.in(idAccount).emit(NOTIFICATION_EVENT.NOTIFICATION, payload);
      await notificationUserService.sendNotificationTopicFCM(idAccount, payload);
    } else {
      _io.in(data.notification_for).emit(NOTIFICATION_EVENT.NOTIFICATION, payload);
      await notificationUserService.sendNotificationTopicFCM(data.notification_for, payload);
    }
  } catch (e) {
    logger.error('Error send notification after create successful: ', e.message);
  }
});

const markReadNotification = catchAsync(async (req, res) => {
  const data = { id: req.body.id };
  req.user.role === NOTIFICATION_FOR.USER ? (data.id_user = req.user.id) : (data.id_staff = req.user.id);
  await notificationUserService.markReadNotification(data);
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('notification.read')));
});

const countUnReadNotification = catchAsync(async (req, res) => {
  const filter = { read: false };
  req.user.role === NOTIFICATION_FOR.USER ? (filter.id_user = req.user.id) : (filter.id_staff = req.user.id);
  const condition = {
    where: filter,
    distinct: true,
  };
  const amount = await notificationUserService.countByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(amount));
});

const detailNotification = catchAsync(async (req, res) => {
  const filter = { id: req.params.id };
  req.user.role === NOTIFICATION_FOR.USER ? (filter.id_user = req.user.id) : (filter.id_staff = req.user.id);
  const detailNotification = await notificationUserService.findOneByCondition({
    where: filter,
    include: [{ model: models.notification, as: 'notifications_parent' }],
  });
  return res.status(httpStatus.OK).json(responseData(detailNotification));
});

const detailNotificationForStaff = catchAsync(async (req, res) => {
  const filter = { id: req.params.id };
  const detailNotification = await notificationUserService.findOneByCondition({
    where: filter,
    include: [{ model: models.notification, as: 'notifications_parent' }],
  });
  return res.status(httpStatus.OK).json(responseData(detailNotification));
});

module.exports = {
  subscribeTopic,
  unSubscribeTopic,
  testNotification,
  listNotification,
  createNotification,
  markReadNotification,
  countUnReadNotification,
  detailNotification,
  detailNotificationForStaff,
};
