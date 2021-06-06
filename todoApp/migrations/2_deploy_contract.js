var todoList = artifacts.require("TodoList");

module.exports = function(deployer) {
  deployer.deploy(todoList);
};
