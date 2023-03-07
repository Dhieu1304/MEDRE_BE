module.exports.createMockData = (data) => {
  const keys = data[0];
  const result = [];
  for (let i = 1; i < data.length; i++) {
    const row = {};
    for (let j = 0; j < data[0].length; j++) {
      if (data[i][j]) {
        if (row[keys[j]] === 'dob') {
          row[keys[j]] = new Date(data[i][j]);
        }
        row[keys[j]] = data[i][j];
      } else row[keys[j]] = null;
    }
    result.push(row);
  }
  return result;
};
