const { Sequelize } = require('sequelize');
const { postgresql } = require('./index');

const sequelize = new Sequelize(postgresql.database, postgresql.username, postgresql.password, {
  host: postgresql.host,
  port: postgresql.port,
  dialect: 'postgres',
  dialectOptions: postgresql.dialectOptions,
  logging: postgresql.logging,
});

module.exports = sequelize;
