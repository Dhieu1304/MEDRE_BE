const models = require('../models');
const { v4: uuidv4 } = require('uuid');

const createNew = async (id_user, id_staff, login_type, refresh_token, expires) => {
  return await models.history_login.create({ id: uuidv4(), id_user, id_staff, login_type, refresh_token, expires });
};

module.exports = {
  createNew,
};
