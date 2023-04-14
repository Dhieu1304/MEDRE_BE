const getLocale = () => {
  let locale = Intl.DateTimeFormat().resolvedOptions().locale;
  if (locale === 'vi-VN') {
    return locale;
  } else {
    locale = 'en-US';
    return locale;
  }
};

module.exports = {
  getLocale,
};
