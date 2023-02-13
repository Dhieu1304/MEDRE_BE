const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const xss = require('xss-clean');
const httpStatus = require('http-status');
require('dotenv').config();

const { initRouter } = require('./src/routes.init');
const ApiError = require('./src/utils/ApiError');
const passport = require("passport");
const {jwtStrategy} = require("./config/passport");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set security HTTP headers
app.use(helmet());

// gzip compression
app.use(compression());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// enable cors
app.use(
  cors({
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);

initRouter(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// error handler
app.use(function (err, req, res, next) {
  return res.status(err.status || 500).json({ status: false, message: err.message || 'Internal error server' });
});

module.exports = app;
