const Joi = require('joi');

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    MONGODB_URL: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
