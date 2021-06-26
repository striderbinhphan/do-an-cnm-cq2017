module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mysql: {
    host: envVars.ENV_DB_HOST,
    port: envVars.ENV_DB_PORT,
    name: envVars.ENV_DB_NAME,
    user: envVars.ENV_DB_USER,
    pass: envVars.ENV_DB_PASSWORD,
  },
};
