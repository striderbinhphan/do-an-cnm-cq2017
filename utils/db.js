const config = require('../config')
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.pass,
    database: config.mysql.name,
  },
  pool: { min: 0, max: 100 },
});
module.exports = knex;
