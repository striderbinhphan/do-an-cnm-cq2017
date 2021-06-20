const db = require('../utils/db');

module.exports = {
  all() {
    return   db('blocks');
  },
  //transaction model
  getTransactionByBlockIndex(index){
    return db('transaction').where('block_index',index);
  },

  //user model 
  getUserList(){
    return db('users');
  },
  addNewUser(newUser){
    return db('users').insert(newUser);
  }
};