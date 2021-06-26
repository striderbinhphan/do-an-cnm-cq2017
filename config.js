const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, './.env') });

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(8000),
    
    ENV_DB_HOST: Joi.string().required(),
    ENV_DB_PORT: Joi.number().required(),
    ENV_DB_NAME: Joi.string().required(),
    ENV_DB_USER: Joi.string().required(),
    ENV_DB_PASSWORD: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  port: envVars.PORT || 8000,
  mysql: {
    host: envVars.ENV_DB_HOST,
    port: envVars.ENV_DB_PORT,
    name: envVars.ENV_DB_NAME,
    user: envVars.ENV_DB_USER,
    pass: envVars.ENV_DB_PASSWORD,
  },
};
