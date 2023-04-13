const i18next = require('i18next');
const { phoneNumberRegex, timeScheduleRegex } = require('./validateCustom');

const phoneNumberFormat = (value, helpers) => {
  if (!value.match(phoneNumberRegex)) {
    return helpers.message(i18next.t('phoneNumber.phoneFormatInvalid'));
  }
  return value;
};

const timeScheduleFormat = (value, helpers) => {
  if (!value.match(timeScheduleRegex)) {
    return helpers.message(i18next.t('timeSchedule.timeFormatInvalid'));
  }
  return value;
};

module.exports = {
  phoneNumberFormat,
  timeScheduleFormat,
};
