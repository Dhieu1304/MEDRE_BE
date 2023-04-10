const pageLimit2Offset = (page, limit) => {
  return { limit, offset: (page - 1) * limit };
};

module.exports = pageLimit2Offset;
