const config = require('../config');
const mobileNotificationService = require('./mobile_notification.service');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const i18next = require('i18next');

const sendPushNotification = catchAsync(async (req, res, next) => {
    const message = {
        app_id: config.one_signal.app_id,
        contents: {en: i18next.t('mobileNotification.test'), vi: i18next.t('mobileNotification.test')},
        included_segments: ["All"],
        content_available: true,
        small_icon: "ic_notification_icon",
        data: {
            PushTitle: "CUSTOM NOTIFICATION",
        },
    };

    mobileNotificationService.sendPushNotification(message, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(httpStatus.OK).json(responseData(result, "success"));
    })
});

const sendPushNotificationToDevice = catchAsync(async (req, res, next) => {
    const message = {
        app_id: config.one_signal.app_id,
        contents: i18next.t('mobileNotification.test'),
        included_segments: ["included_player_ids"],
        included_player_ids: req.body.devices,
        content_available: true,
        small_icon: "ic_notification_icon",
        data: {
            PushTitle: "CUSTOM NOTIFICATION",
        },
    };

    mobileNotificationService.sendPushNotification(message, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(httpStatus.OK).json(responseData(result, "success"));
    })
});

module.exports = {
    sendPushNotification,
    sendPushNotificationToDevice,
}