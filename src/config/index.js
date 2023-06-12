const Joi = require('joi');

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_VERIFY_EXPIRATION_HOURS: Joi.string().description('hours after which verify tokens expire'),
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
    NODEMAILER_EMAIL: Joi.string().required().description('Email'),
    NODEMAILER_PASSWORD: Joi.string().required().description('Password'),
    BE_URL: Joi.string().required().description('Url of backend'),
    FE_USER_URL: Joi.string().required().description('Url of user frontend'),
    FE_ADMIN_URL: Joi.string().required().description('Url of admin frontend'),
    FB_PRIVATE_KEY_ID: Joi.string().required().description('Private key id Firebase Admin'),
    FB_PRIVATE_KEY: Joi.string().required().description('Private key Firebase Admin'),
    VNP_TMN_CODE: Joi.string().required().description('VNPay tmn code'),
    VNP_HASH_SECRET: Joi.string().required().description('VNPay hash secret'),
    SMS_API_KEY: Joi.string().required().description('SMS API key'),
    SMS_SECRET_KEY: Joi.string().required().description('SMS secret key'),
    OS_APP_ID: Joi.string().required().description('One signal app id'),
    OS_API_KEY: Joi.string().required().description('One signal api key'),
    REDIS_URL: Joi.string().description('One signal api key'),
    REDIS_PASSWORD: Joi.string().description('One signal api key'),
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
    verifyExpirationHours: envVars.JWT_VERIFY_EXPIRATION_HOURS,
  },
  nodemailer: {
    nm_email: envVars.NODEMAILER_EMAIL,
    nm_password: envVars.NODEMAILER_PASSWORD,
  },
  base_url: {
    be_url: envVars.BE_URL,
    fe_user_url: envVars.FE_USER_URL,
    fe_admin_url: envVars.FE_ADMIN_URL,
  },
  firebaseAdmin: {
    privateKeyId: envVars.FB_PRIVATE_KEY_ID,
    privateKey: envVars.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
    storageBucket: 'medre-9f7f5.appspot.com',
  },
  vn_pay: {
    tmnCode: envVars.VNP_TMN_CODE,
    hashSecret: envVars.VNP_HASH_SECRET,
    url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    returnUrl: `${envVars.BE_URL}/payment/vnpay-return`,
  },
  sms: {
    apiKey: envVars.SMS_API_KEY,
    secretKey: envVars.SMS_SECRET_KEY,
  },
  one_signal: {
    app_id: envVars.OS_APP_ID,
    api_key: envVars.OS_API_KEY,
  },
  redis: {
    url: envVars.REDIS_URL,
    password: envVars.REDIS_PASSWORD,
  },
};
