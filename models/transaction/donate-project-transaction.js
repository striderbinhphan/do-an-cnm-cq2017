const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
class DonateTransaction{
    constructor(projectId, fromAddress, toAddress, amount, donateTimestamp,signature) {
        this.projectId  = projectId; 
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount  = amount;
        this.donateTimestamp = donateTimestamp;
        this.signature = null || signature;
    }
    calculateHash(){
        return SHA256(this.projectId + this.fromAddress+this.toAddress+this.amount+this.donateTimestamp).toString();
    }
    signTransaction(senderEcKey){
        console.log("signing donate transaction");

        if(senderEcKey.getPublic('hex') != this.fromAddress){
            console.log('You cannot sign transaction with another wallets!')
            return false;
        }
        const hashTx = this.calculateHash();
        const sig = senderEcKey.sign(hashTx,'base64');
        this.signature  = sig.toDER('hex');
        return true;
    }
    isValidTransaction(){
        if(this.projectId  === null){
            return false
        };
        if(!this.signature || this.signature.length ===0){
            console.log('No signature in this transaction')
            return false;
        }
        const publicKey  = ec.keyFromPublic(this.fromAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
    parseData(data) {
        this.projectId  = data.projectId; 
        this.fromAddress = data.fromAddress;
        this.toAddress = data.toAddress;
        this.amount  = data.amount;
        this.donateTimestamp = data.donateTimestamp;
        this.signature = data.signature ||null;
    }
}
module.exports = DonateTransaction;