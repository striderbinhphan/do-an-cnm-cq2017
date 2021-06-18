const db = require('../../utils/db');

module.exports = {
  all: _ => db.load('select * from projectid'),
  detail: id => db.load(`select * from projectid where ProjectID = "${id}"`),
};
