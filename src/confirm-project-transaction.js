const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
class ConfirmProjectTransaction{
    constructor(projectId,organizeAddress, beneficiaryAddress,timestamp){
        this.projectId = projectId;
        this.organizeAddress = organizeAddress;
        this.beneficiaryAddress = beneficiaryAddress;
        this.timestamp = timestamp;
    }
    
    calculateHash(){
        return SHA256(this.projectId+this.organizeAddress+this.beneficiaryAddress+this.timestamp).toString();
    }
    signTransaction(organizationEcKey){
        console.log("signing confirm transaction");
        if(organizationEcKey.getPublic('hex') != this.organizeAddress){
            console.log('You cannot sign transaction with another wallets!')
            return false;
        }
        const hashTx = this.calculateHash();
        const sig = organizationEcKey.sign(hashTx,'base64');
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
        const publicKey  = ec.keyFromPublic(this.organizeAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
    parseData(data) {
        this.projectId = data.projectId;
        this.organizeAddress = data.organizeAddress;
        this.beneficiaryAddress = data.beneficiaryAddress;
        this.timestamp = data.timestamp;
    }
}
module.exports = ConfirmProjectTransaction;