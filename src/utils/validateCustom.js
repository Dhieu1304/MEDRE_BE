const i18next = require('i18next');

const phoneNumberRegex = /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/;
const timeScheduleRegex = /^([0-9]{2}):(00|30):(00)$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message(i18next.t('password.password8'));
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(i18next.t('password.passwordLetterNumber'));
  }
  return value;
};

module.exports = {
  phoneNumberRegex,
  timeScheduleRegex,
  password,
  emailRegex,
};
