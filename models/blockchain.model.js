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

  //project model
  getProjectList(){
    return db('project');
  },
  addProject(projectTemp)
  {
    return db('project').insert(projectTemp);
  },

  //node model

  getNodeList(){
    return db('nodes');
  },
  
  addNode(newNode)
  {
    return db('nodes'),insert(newNode);
  }

  //pendingTransaction model
  
};