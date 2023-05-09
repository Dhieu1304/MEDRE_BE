const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const xss = require('xss-clean');
const httpStatus = require('http-status');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
require('dotenv').config();

const { initRouter } = require('./src/routes.init');
const ApiError = require('./src/utils/ApiError');
const passport = require('passport');
const { jwtStrategy } = require('./src/config/passport');
const { getLocale } = require('./src/utils/locale');

require('./src/models/mockup-data');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src')));

// set security HTTP headers
app.use(helmet());

// gzip compression
app.use(compression());

// sanitize request data
app.use(xss());

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

//config i18next
const lang = getLocale();

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: lang,
    preload: ['vi', 'en'],
    saveMissing: true,
    detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie'],
    },
  });

app.use(i18nextMiddleware.handle(i18next));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// error handler
app.use(function (err, req, res, next) {
  return res.status(err.status || 500).json({ status: false, message: err.message || 'Internal error server' });
});

module.exports = app;
