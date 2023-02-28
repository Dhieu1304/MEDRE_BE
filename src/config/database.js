const { Sequelize } = require('sequelize');
const { postgresql } = require('./index');

const sequelize = new Sequelize(postgresql.database, postgresql.username, postgresql.password, {
  host: postgresql.host,
  port: postgresql.port,
  dialect: 'postgres',
  dialectOptions: postgresql.dialectOptions,
  pool: postgresql.pool,
  logging: postgresql.logging,
});

if (postgresql.db_sync === '1') {
  // await db.sync({ force: true });
}

module.exports = sequelize;
