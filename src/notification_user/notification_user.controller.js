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

const sendPushNotification = catchAsync(async (req, res, next) => {
  const message = {
    app_id: config.one_signal.app_id,
    contents: { en: i18next.t('mobileNotification.test'), vi: i18next.t('mobileNotification.test') },
    included_segments: ['All'],
    content_available: true,
    small_icon: 'ic_notification_icon',
    data: {
      PushTitle: 'CUSTOM NOTIFICATION',
    },
  };

  notificationUserService.sendPushNotification(message, (error, result) => {
    if (error) {
      return next(error);
    }
    return res.status(httpStatus.OK).json(responseData(result, 'success'));
  });
});

const sendPushNotificationToDevice = catchAsync(async (req, res, next) => {
  const message = {
    app_id: config.one_signal.app_id,
    contents: i18next.t('mobileNotification.test'),
    included_segments: ['included_player_ids'],
    included_player_ids: req.body.devices,
    content_available: true,
    small_icon: 'ic_notification_icon',
    data: {
      PushTitle: 'CUSTOM NOTIFICATION',
    },
  };

  notificationUserService.sendPushNotification(message, (error, result) => {
    if (error) {
      return next(error);
    }
    return res.status(httpStatus.OK).json(responseData(result, 'success'));
  });
});

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
  return res.status(httpStatus.OK).json(responseMessage('Successfully FCM'));
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
  const notificationUser = pick(req.body, ['id_user', 'id_staff']);
  data.created_by = req.user.id;
  if (data.notification_for === NOTIFICATION_FOR.PERSONAL) {
    if (Object.keys(notificationUser).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json(responseMessage('id_user or id_staff is required', false));
    }
  }
  await notificationUserService.createNotification(data, notificationUser);
  res.status(httpStatus.OK).json(responseMessage('Create notification successfully'));

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
  return res.status(httpStatus.OK).json(responseMessage('Read notification successfully'));
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
  sendPushNotification,
  sendPushNotificationToDevice,
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
