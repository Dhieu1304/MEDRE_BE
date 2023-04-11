const i18next = require('i18next');

const phoneNumberRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message(i18next.t('register.password8'));
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(i18next.t('register.passwordLetterNumber'));
  }
  return value;
};

module.exports = {
  phoneNumberRegex,
  objectId,
  password,
};
