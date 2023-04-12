const express = require('express');
const i18next = require('i18next');
const httpStatus = require('http-status');
const { responseMessage } = require('../src/utils/responseFormat');

const router = express.Router();

router.get('/vi', (req, res) => {
  i18next.changeLanguage('vi').then();
  res.cookie('lang', 'en', { maxAge: 900000 });
  return res.status(httpStatus.OK).json(responseMessage('Change language to [vi] successfully'));
});

router.get('/en', (req, res) => {
  i18next.changeLanguage('en').then();
  res.cookie('lang', 'en', { maxAge: 900000 });
  return res.status(httpStatus.OK).json(responseMessage('Change language to [en] successfully'));
});

module.exports = router;
