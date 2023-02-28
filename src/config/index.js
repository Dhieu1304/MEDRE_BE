const Joi = require('joi');

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    DB_SYNC: Joi.number().default(0).valid(0, 1).description('sync database'),
    DB_HOST: Joi.string().required().description('Host'),
    DB_DATABASE: Joi.string().required().description('Database'),
    DB_USERNAME: Joi.string().required().description('Username'),
    DB_PASSWORD: Joi.string().required().description('Password'),
    DB_PORT: Joi.number().required().description('Port'),
    HDB_HOST: Joi.string().required().description('Host'),
    HDB_DATABASE: Joi.string().required().description('Database'),
    HDB_USERNAME: Joi.string().required().description('Username'),
    HDB_PASSWORD: Joi.string().required().description('Password'),
    HDB_PORT: Joi.number().required().description('Port'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  postgresql: {
    database: envVars.NODE_ENV === 'production' ? envVars.HDB_DATABASE : envVars.DB_DATABASE,
    username: envVars.NODE_ENV === 'production' ? envVars.HDB_USERNAME : envVars.DB_USERNAME,
    password: envVars.NODE_ENV === 'production' ? envVars.HDB_PASSWORD : envVars.DB_PASSWORD,
    host: envVars.NODE_ENV === 'production' ? envVars.HDB_HOST : envVars.DB_HOST,
    port: envVars.NODE_ENV === 'production' ? envVars.HDB_PORT : envVars.DB_PORT,
    dialectOptions:
      envVars.NODE_ENV === 'production'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
    db_sync: envVars.DB_SYNC,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
};
