const i18next = require('i18next');
const { phoneNumberRegex, timeScheduleRegex, emailRegex } = require('./validateCustom');

const phoneNumberFormat = (value, helpers) => {
  let result = value;
  if (!result.match(phoneNumberRegex)) {
    return helpers.message(i18next.t('phoneNumber.phoneFormatInvalid'));
  }

  // convert to start with 0
  const startPhoneNumber = ['+84', '84', '0084'];
  for (let i = 0; i < startPhoneNumber.length; i++) {
    if (result.startsWith(startPhoneNumber[i])) {
      result = result.replace(startPhoneNumber[i], '0');
      break;
    }
  }

  return result;
};

const emailFormat = (value, helpers) => {
  let result = value;
  if (!result.match(emailRegex)) {
    return helpers.message(i18next.t('email.emailFormatInvalid'));
  }

  return result;
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
  emailFormat,
};
