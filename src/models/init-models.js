const DataTypes = require('sequelize').DataTypes;
const _staff = require('../staff/staff.model');
const _user = require('../user/user.model');

function initModels(sequelize) {
  const staff = _staff(sequelize, DataTypes);
  const user = _user(sequelize, DataTypes);

  return {
    staff,
    user,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
