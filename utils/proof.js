const { constants } = require("./constants");
const {calculateHash, hashMatchesDifficulty} = require('./common-function');
process.on("message", (block) => {
  const { index, timestamp, transactions, previousHash,  difficulty} = block;
  let count = 0;
  let nonce = 0;
  let startTime = Date.now();
  while (true) {
    count++;
    let hash = calculateHash(index,timestamp,transactions,previousHash,nonce,difficulty);
            // if (hash.substring(0,difficulty)== Array(difficulty+1).join("0")) {
            //     return new Block(index,timestamp,transactions,previousHash,difficulty,nonce, hash);
            // }
            if(hashMatchesDifficulty(hash,difficulty)){
                console.log("I minne a block");
                process.send(nonce);
                console.log(
                    `Number of loop: ${count} Time mining: ${Date.now() - startTime} ms`
                );
                process.exit(0);
            };
            nonce++;
  }
  
});
