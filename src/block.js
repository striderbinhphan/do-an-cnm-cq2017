const Transaction = require('./transaction');
//Description block in our blockchain
class Block{
    constructor(index,timestamp, transactions, previousHash, difficulty, nonce, hash)
    {
        this.index = index;
        this.timestamp = timestamp
        this.transactions = transactions;//{type:"create/donate",data:"{followType get data type corresponding}"}
        //transactions structure
        // {
        //     "type":"create",
        //     "data":{
        //         "projectId":"",
        //         "beneficiaryAdress":"",
        //         "timestamp":""
        //     }
        // },
        // {
        //     "type":"confirm",
        //     "data":{
        //         "projectId":"",
        //         "organizeAddress":"",
        //         "beneficiaryAdress":"",
        //         "timestamp":""
        //     }
        // },
        // {
        //     "type":"send",
        //     "data":{
        //         "projectId":"",
        //         "fromAddress":"",
        //         "toAddress":"",
        //         "amount":"",
        //         "timestamp":""
        //     }
        // },
        this.previousHash = previousHash;
        this.difficulty = difficulty;
        this.nonce = nonce;
        this.hash = hash;
    }
    
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
}
module.exports = Block;