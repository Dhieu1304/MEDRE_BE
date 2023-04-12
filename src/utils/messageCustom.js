const i18next = require('i18next');
const { phoneNumberRegex } = require('./validateCustom');

const phoneNumberFormat = (value, helpers) => {
  if (!value.match(phoneNumberRegex)) {
    return helpers.message(i18next.t('phoneNumber.phoneFormatInvalid'));
  }
  return value;
};

module.exports = {
  phoneNumberFormat,
};
