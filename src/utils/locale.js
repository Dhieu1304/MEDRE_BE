const getLocale = () => {
    let locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if(locale === 'vi-VN')
    {
      return locale;
    }
    else {
      locale = 'en-US';
      return locale;
    }
    
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