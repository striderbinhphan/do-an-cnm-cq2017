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
  },
  getTransactionByProjectID(projectID){
    return db('transaction').where('project_id',projectID);
  },
  getProjectByID(projectID){
     return db('project').where('project_id',projectID);
  },
  getTransactionByID(transactionID){
    return db('transaction').where('transaction_id',transactionID);
  },
  getTotalDonateByProjectID(projectID){
    return db('transaction').sum('donate_txs_amount as totaldonate').where('project_id',projectID).where('transaction_type',"donate");
  },
  getTotalSendBackByProjectID(projectID){
    return db('transaction').sum('sendback_txs_amount as totalsendback').where('project_id',projectID).where('transaction_type',"sendback");
  }
};