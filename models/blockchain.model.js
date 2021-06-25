const db = require('../utils/db');

module.exports = {
  //blocks model
  all() {
    return   db('blocks');
  },
  addNewBlock(newBlock){
    return db('blocks').insert(newBlock);
  },
  //transaction model
  getTransactionByBlockIndex(index){
    return db('transaction').where('block_index',index);
  
  },
  getTransactionByProjectID(projectID){
    return db('transaction').where('project_id',projectID);
  },
  getDonateTransactionByProjectID(projectID){
    return db('transaction').where('project_id',projectID).where('transaction_type',"donate");
  },
  getSendbackTransactionByProjectID(projectID){
    return db('transaction').where('project_id',projectID).where('transaction_type',"sendback");
  },
  getTransactionByID(transactionID){
    return db('transaction').where('transaction_id',transactionID);
  },
  getTotalDonateByProjectID(projectID){
    return db('transaction').sum('donate_txs_amount as totaldonate').where('project_id',projectID).where('transaction_type',"donate");
  },
  getTotalSendBackByProjectID(projectID){
    return db('transaction').sum('sendback_txs_amount as totalsendback').where('project_id',projectID).where('transaction_type',"sendback");
  },


        //add transaction in blocks to transaction table
  addTransactionInBlock(transaction){
    return db('transaction').insert(transaction);
  },
  //user model 
  getUserList(){
    return db('users');
  },
  addNewUser(newUser){
    return db('users').insert(newUser);
  },
  getUserByAddress(address){
    return db('users').where('address',address);
  },

  //project model
  getProjectList(){
    return db('project');
  },
  addProject(projectTemp)
  {
    return db('project').insert(projectTemp);
  },
  updateConfirmAddress(projectId, address, timestamp){
    console.log("testinggggggggggggggggggggggggggggggggggg",projectId);
    return db('project').where({
      project_id: projectId
    }).update({
      project_organization_confirm_address: address,
      project_confirm_timestamp: timestamp
    })
  },
  getProjectByID(projectID){
    return db('project').where('project_id',projectID);
 },

  //node model

  getNodeList(){
    return db('nodes');
  },
  
  addNode(newNode)
  {
    return db('nodes').insert(newNode);
  },

  //pendingTransaction model
  addTransactionToPDTable(transaction){
    
      
    return db('pending_transactions').insert(transaction);
  },
  getPendingTransactions(){
    return db('pending_transactions');
  },
  deletePendingTransactionBySignature(signature){
    return db('pending_transactions').where('transaction_signature',signature).del();
  }

  //pendingTransaction model
  
};