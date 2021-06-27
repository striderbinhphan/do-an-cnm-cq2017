const { transactions, constants } = require("./utils/constants");
const fork = require("./utils/global");
const Transaction = require("./models/transaction/transaction");
const Block = require("./models/block");
const BlockChain = require("./models/blockchain");

/**
 *
 * @param {SocketIO.Server} io
 * @param {SocketIOClient.Socket} socket
 * @param {BlockChain} chain
 */
const socketListeners = (io, socket, chain) => {
  socket.on(transactions.ADD_TRANSACTION, (newTransaction) => {
    const tx = new Transaction(null,null);
    tx.parseData(newTransaction);
    chain.addTransaction(tx);
    console.info(
      `Added action: ${JSON.stringify(tx)}`
    );
  });

  socket.on(transactions.END_MINING, (data) => {
    const { blocks } = data;
    console.log("End Mining encountered");
    fork().kill("SIGINT");
    fork().on("exit", () => {
      chain.reset();
      const blockChain = new BlockChain();
      blockChain.parseChain(blocks);
      if (
        blockChain.checkValidity() &&
        blockChain.getLength() >= chain.getLength()
      ) {
        console.log("The chain pass first check");
        if (chain.compareCurrentBlock(blockChain.blocks)) {
          console.log("The chain pass all check");
          io.emit(transactions.CHAIN_VERIFY);
          chain.confirmBlock();
        } else {
          console.log("The chain fail second check");
          io.emit(transactions.WRONG_HASH_GENERATE);
          chain.denyBlock();
          socket.disconnect();
          chain.nodes.splice(chain.nodes.indexOf(socket), 1);
        }
      } else {
        console.log("Something is wrong with the chain");
        io.emit(transactions.WRONG_HASH_GENERATE);
        chain.denyBlock();
        socket.disconnect();
        chain.nodes.splice(chain.nodes.indexOf(socket), 1);
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



  // socket.on(transactions.ADD_TRANSACTION, (data) => {
  //   const { year, name, nominees, deadline } = data;
  //   chain.setElection(year, name, nominees, deadline);
  // });

  // socket.on(transactions.EXTEND_PROJECT_DEADLINE, (data) => {
  //   const { year, name, newDeadline } = data;
  //   chain.extentElection(year, name, newDeadline);
  // });

  socket.on(transactions.CHECKING, () => {
    console.log("Im OK");
  });
  socket.on(transactions.ADD_USER, (newUser) => {
    console.log("added new User to our ledger", newUser);
    chain.createUser(newUser);
  });
  return socket;
};

module.exports = socketListeners;
