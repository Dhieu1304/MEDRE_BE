const express = require('express');
const i18next = require('i18next'); 
const authRouter = require('./auth/auth.route');
const userRouter = require('./user/user.route');
const staffRouter = require('./staff/staff.route');
const scheduleRouter = require('./schedule/schedule.route');
const timeScheduleRouter = require('./time_schedule/time_schedule.route');
const bookingRouter = require('./booking/booking.route');
const expertiseRouter = require('./expertise/expertise.route');
const patientRouter = require('./patient/patient.route');

module.exports.initRouter = (app) => {
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/staff', staffRouter);
  app.use('/schedule', scheduleRouter);
  app.use('/time-schedule', timeScheduleRouter);
  app.use('/booking', bookingRouter);
  app.use('/expertise', expertiseRouter);
  app.use('/patient', patientRouter);

  //language
  app.use(express.Router().get('/language/vi'), (req, res) => {
    i18next.changeLanguage('vi');
    res.cookie('lang', 'en', { maxAge: 900000 });
    return res.status(200).send('MEDRE_API');

  });
  app.use(express.Router().get('/language/en'), (req, res) => {
    i18next.changeLanguage('en');
    res.cookie('lang', 'en', { maxAge: 900000 });
    return res.status(200).send('MEDRE_API');
  });
  
  app.use(express.Router().get('/'), (req, res) => {
    return res.status(200).send('MEDRE_API');
  });
};
