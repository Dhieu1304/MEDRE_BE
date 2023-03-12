const express = require('express');
const authRouter = require('./auth/auth.route');
const userRouter = require('./user/user.route');
const staffRouter = require('./staff/staff.route');
const scheduleRouter = require('./schedule/schedule.route');
const bookingRouter = require('./booking/booking.route');
const expertiseRouter = require('./expertise/expertise.route');

module.exports.initRouter = (app) => {
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/staff', staffRouter);
  app.use('/schedule', scheduleRouter);
  app.use('/booking', bookingRouter);
  app.use('/expertise', expertiseRouter);
  app.use(express.Router().get('/'), (req, res) => {
    return res.status(200).send('MEDRE_API');
  });
};
