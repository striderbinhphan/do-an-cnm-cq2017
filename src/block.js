const Transaction = require('./transaction/transaction');
const SHA256 = require('crypto-js/sha256');
//Description block in our blockchain
class Block{
    constructor(index,timestamp, transactions, previousHash, nonce, difficulty, hash)
    {
        this.index = index;
        this.timestamp = timestamp
        this.transactions = transactions;//{type:"create/donate",data:"{followType get data type corresponding}"}
        this.previousHash = previousHash;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.hash = hash||this.calculateHash();
    }
    calculateHash(){
        return SHA256(this.index+this.timestamp+JSON.stringify(this.transactions)+this.previousHash+this.nonce+this.difficulty).toString();
    };
    // mineBlock(){
    //     while(this.hash.substring(0,this.difficulty)!= Array(this.difficulty+1).join("0")){
    //         this.nonce ++;
    //         this.hash = this.calculateHash();
    //     }
    //     console.log("block mined " + this.hash);
    // }
    hasValidTransactions(){
        for (const tx of this.transactions) {
            let txtemp = new Transaction(tx.fromAddress,tx.toAddress,tx.amount,tx.projectId,tx.deadline,tx.timestamp,tx.blockIndex);
            if(!txtemp.isValidTransaction()){
                return false;
            }
        }
        return true;
    }
    getIndex(){
        return this.index;
    }
    getBlockTransactions() {
        return this.transactions;
    }
    parseBlock(block){
        this.index = block.index;
        this.timestamp = block.timestamp;
        this.transactions = block.transactions;
        this.previousHash = block.previousHash;
        this.nonce = block.nonce;
        this.difficulty = block.difficulty; 
        this.hash = block.hash;
    }
}
module.exports = Block;