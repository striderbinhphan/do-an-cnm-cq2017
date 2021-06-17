const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
class SendbackProjectTransaction{
    constructor(projectId, fromAddress, toAddress, amount, sendbackTimestamp) {
        this.projectId  = projectId; 
        this.fromAddress = fromAddress;//projectOrganizationConfirmAddress
        this.toAddress = toAddress;//projectBeneficiaryCreateAddress
        this.amount  = amount;
        this.sendbackTimestamp = sendbackTimestamp;
    }
    calculateHash(){
        return SHA256(this.projectId + this.fromAddress+this.toAddress+this.amount+this.sendbackTimestamp).toString();
    }
    signTransaction(senderEcKey){
        console.log("signing sendback transaction");

        if(senderEcKey.getPublic('hex') != this.fromAddress){
            return 'You cannot sign transaction with another wallets!';
        }
        const hashTx = this.calculateHash();
        const sig = senderEcKey.sign(hashTx,'base64');
        this.signature  = sig.toDER('hex');
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
    // const Tx = new Transaction(data);
    //tx. = =
    parseData(data) {
        this.projectId  = data.projectId; 
        this.fromAddress = data.fromAddress;
        this.toAddress = data.toAddress;
        this.amount  = data.amount;
        this.sendbackTimestamp = data.sendbackTimestamp;
    }
}
module.exports = SendbackProjectTransaction;