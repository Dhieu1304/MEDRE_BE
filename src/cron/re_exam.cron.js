/*global _io*/
/*eslint no-undef: "error"*/
const schedule = require('node-schedule');
const logger = require('../config/logger');
const models = require('../models');
const moment = require('moment');
const { NOTIFICATION_TYPE, NOTIFICATION_FOR } = require('../notification/notification.constant');
const notificationUserService = require('../notification_user/notification_user.service');
const { NOTIFICATION_EVENT } = require('../socket/socket.constant');

const cronReExam = async () => {
  try {
    const date_re_exam = moment(new Date()).add(2, 'days');
    const listReExam = await models.re_examination.findAll({
      where: {
        is_apply: true,
        date_re_exam,
      },
      include: [
        {
          model: models.booking,
          as: 're_exam_of_booking',
          include: [
            {
              model: models.user,
              as: 'booking_of_user',
            },
          ],
        },
      ],
    });

    // create notification
    const content = `Bạn có lịch tái khám vào ngày ${date_re_exam}, vui lòng đặt lịch.`;
    const notificationData = {
      type: NOTIFICATION_TYPE.EVENT,
      notification_for: NOTIFICATION_FOR.PERSONAL,
      title: 'Tái khám',
      content,
    };
    for (let i = 0; i < listReExam.length; i++) {
      const id_user = listReExam[i].re_exam_of_booking.booking_of_user.id;
      await notificationUserService.createNotification(notificationData, { id_user });

      // send notification to user
      const payload = {
        notification: {
          title: 'Tái khám',
          body: content,
          type: NOTIFICATION_TYPE.EVENT,
        },
      };
      _io.in(id_user).emit(NOTIFICATION_EVENT.NOTIFICATION, payload);
      await notificationUserService.sendNotificationTopicFCM(id_user, payload);
    }
  } catch (e) {
    console.error('Error cron re_exam: ', e);
  }
};

// run cron every day at 0h -> 7h at VietNam
schedule.scheduleJob(`0 0 * * *`, async () => {
  logger.info('Run cron re_exam');
  await cronReExam();
});
