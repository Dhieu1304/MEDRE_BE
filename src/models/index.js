const initModels = require('./init-models');
const db = require('../config/database');
const models = initModels(db);

module.exports = models;
