const { transactions, constants } = require("./utils/constants");
const fork = require("./utils/global");
const Transaction = require("./src/transaction/transaction");
const Block = require("./src/block");
const BlockChain = require("./src/blockchain");

/**
 *
 * @param {SocketIO.Server} io
 * @param {SocketIOClient.Socket} socket
 * @param {BlockChain} chain
 */
const socketListeners = (io, socket, chain) => {
  


  //OK OKKKKKKKKOKKKKKKKKKKKKKKKKKKKK methods
  //OK OKKKKKKKKOKKKKKKKKKKKKKKKKKKKK methods
  //OK OKKKKKKKKOKKKKKKKKKKKKKKKKKKKK methods

  socket.on(transactions.ADD_USER, (newUser) => {
    console.log("added new User to our ledger", newUser);
    chain.register(newUser);
  });
  
  socket.on(transactions.ADD_PROJECT,(newProjectInfo)=>{
    console.log("added new project to our ledger",newProjectInfo);
    chain.addProject(newProjectInfo);
  });
  
  socket.on(transactions.ADD_TRANSACTION, (newTransaction) => {
    const tx = new Transaction(null,null);
    tx.parseData(newTransaction);
    chain.addTransaction(tx);
    console.info(
      `Added action: ${JSON.stringify(tx)}`
    );
  });
  
  socket.on(transactions.CONFIRM_PROJECT,(confirmData)=>{
    console.log("confirmt project to our ledger",confirmData);
    chain.updateProject(confirmData);
  })
  
  socket.on(transactions.END_MINING, (data) => {
    const { blocks } = data;
    console.log("End Mining encountered");
    fork().kill("SIGINT");
    fork().on("exit", () => {
      chain.reset();
      const blockChain = new BlockChain();
      blockChain.parseChain(blocks);
      console.log("incoming block chainnnnnnnnnnnnnn", blockChain);
      console.log("incoming block chainnnnnnnnnnnnnn length", blockChain.getLength());
      console.log("currents block chainnnnnnnnnnnnnn", chain);
     
      console.log("currents block chainnnnnnnnnnnnnn length", chain.getLength());
      if (
        blockChain.checkValidity() &&
        blockChain.getLength() >= chain.getLength()
      ) {
        console.log("Peep2peer check chain", chain.getBlocks());
        console.log("The chain pass first check");
        if (chain.compareCurrentBlock(blockChain.blocks)) {
          console.log("The chain pass all check");
          io.emit(transactions.CHAIN_VERIFY);
          chain.confirmBlock();
        } else {
          console.log("The chain fail second check");
          io.emit(transactions.WRONG_HASH_GENERATE);
          chain.denyBlock();
        }
      } else {
        console.log("Something is wrong with the chain");
        io.emit(transactions.WRONG_HASH_GENERATE);
        chain.denyBlock();
      }
    });
  });
  
  socket.on(transactions.WRONG_HASH_GENERATE, () => {
    chain.denyBlock();
  });

  socket.on(transactions.HELLO, () => {
    console.log("hello");
  });

  socket.on(transactions.CHAIN_VERIFY, () => {
    chain.confirmBlock();
  });

  socket.on(transactions.CHECKING, () => {
    console.log("Im OK");
  });
  
  

  return socket;
};

module.exports = socketListeners;
