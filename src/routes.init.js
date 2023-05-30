const express = require('express');
const authRouter = require('./auth/auth.route');
const userRouter = require('./user/user.route');
const staffRouter = require('./staff/staff.route');
const scheduleRouter = require('./schedule/schedule.route');
const timeScheduleRouter = require('./time_schedule/time_schedule.route');
const bookingRouter = require('./booking/booking.route');
const expertiseRouter = require('./expertise/expertise.route');
const patientRouter = require('./patient/patient.route');
const language = require('../locales/language');
const doctorTimeOffRouter = require('./doctor_time_off/doctor_time_off.route');
const uploadRouter = require('./upload/upload.route');
const paymentRouter = require('./payment/payment.route');
const notificationRouter = require('./notification_user/notification_user.route');
const globalSettingRouter = require('./global_setting/global_setting.route');
const checkupPackageRouter = require('./checkup_package/checkup_package.route');
const reExaminationRouter = require('./re_examination/re_examination.route');

module.exports.initRouter = (app) => {
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/staff', staffRouter);
  app.use('/schedule', scheduleRouter);
  app.use('/time-schedule', timeScheduleRouter);
  app.use('/booking', bookingRouter);
  app.use('/expertise', expertiseRouter);
  app.use('/patient', patientRouter);
  app.use('/language', language);
  app.use('/doctor-time-off', doctorTimeOffRouter);
  app.use('/upload', uploadRouter);
  app.use('/payment', paymentRouter);
  app.use('/notification', notificationRouter);
  app.use('/setting', globalSettingRouter);
  app.use('/checkup-package', checkupPackageRouter);
  app.use('/re-examination', reExaminationRouter);

  app.use(express.Router().get('/'), (req, res) => {
    return res.status(200).send('MEDRE_API');
  });
};
