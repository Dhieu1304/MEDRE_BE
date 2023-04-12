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

  app.use(express.Router().get('/'), (req, res) => {
    return res.status(200).send('MEDRE_API');
  });
};
