const responseMessage = (message, status = true) => {
  return { status, message };
};

const responseData = (data, message = '') => {
  return { status: true, message, data };
};

module.exports = {
  responseData,
  responseMessage,
};
