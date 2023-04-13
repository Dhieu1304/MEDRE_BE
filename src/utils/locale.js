const getLocale = () => {
    let locale = Intl.DateTimeFormat().resolvedOptions().locale;
    console.log(locale);
    return locale;
};

const getLanguage = () => {
    let language = window.navigator.userLanguage || window.navigator.language;
    console.log(language);
    return language;
};
 

  module.exports = {
    getLocale,
    getLanguage
  };