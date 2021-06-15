const SHA256 = require("crypto-js/sha256");
const calculateHash = (index,timestamp,transactions, previousHash,nonce,difficulty)=>{
    return SHA256(index+timestamp+JSON.stringify(transactions)+previousHash+nonce+difficulty).toString();
};
const hashMatchesDifficulty = (hash,difficulty) =>{
    const requiredPrefix  = Array(difficulty+1).join("0");
    const falsePrefix = Array(difficulty+2).join("0");
    if(hash.startsWith(requiredPrefix)&&(!hash.startsWith(falsePrefix))){
        return true;
    }
    return false;
};
const calculateHashFromBlock = (block)=>{
    return SHA256(block.index+block.timestamp+JSON.stringify(block.transactions)+block.previousHash+block.nonce+block.difficulty).toString();
};
module.exports = {calculateHash,hashMatchesDifficulty,calculateHashFromBlock};