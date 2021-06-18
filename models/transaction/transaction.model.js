const db = require('../../utils/db');

module.exports = {
  all: _ => db.load('select * from transaction'),
  detail: id => db.load(`select * from transaction where id = ${id}`),
  transactionProject: id => db.load(`select * from transaction where projectID = "${id}"`),
  
};