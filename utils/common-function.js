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
const getFormattedDate = (date)=>{
    if(date===null || date === undefined){
        var d = new Date();

        d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);

        return d;
    }
    else{
        var d = new Date(date);

        d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);

        return d;
   }
}
const getTimestamp = (date) =>{
    return new Date(date).getTime();
}
module.exports = {calculateHash,hashMatchesDifficulty,calculateHashFromBlock, getFormattedDate, getTimestamp};


