const express = require('express');
const authRouter = require('./auth/auth.route');
const userRouter = require('./user/user.route');
const staffRouter = require('./staff/staff.route');

module.exports.initRouter = (app) => {
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/staff', staffRouter);
  app.use(express.Router().get('/'), (req, res) => {
    return res.status(200).send('MEDRE_API');
  });
};
