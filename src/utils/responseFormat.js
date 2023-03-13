const responseMessage = (message, status = true) => {
  return { status, message };
};

const responseData = (data, message = '') => {
  return { status: true, message, data };
};

// data is object from findAndCountAll of sequelize
const paginationFormat = (data, page, limit) => {
  return {
    results: data.rows,
    page,
    limit,
    totalPages: Math.ceil(data.count / limit),
    totalResults: data.count,
  };
};

module.exports = {
  responseData,
  responseMessage,
  paginationFormat,
};
