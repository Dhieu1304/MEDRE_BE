const { v4: uuidv4 } = require('uuid');

module.exports.createMockData = (data) => {
  const keys = data[0];
  const result = [];
  for (let i = 1; i < data.length; i++) {
    const row = {};
    row.id = uuidv4();
    for (let j = 0; j < data[0].length; j++) {
      if (data[i][j]) row[keys[j]] = data[i][j];
      else row[keys[j]] = null;
    }
    result.push(row);
  }
  return result;
};
