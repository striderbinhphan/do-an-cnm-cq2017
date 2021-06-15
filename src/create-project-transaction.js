const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
class CreateProjectTransaction{
    constructor(projectId,beneficiaryAddress, timestamp){
        this.projectId = projectId;
        this.beneficiaryAddress = beneficiaryAddress;
        this.timestamp = timestamp;
    }

    calculateHash(){
        return SHA256(this.projectId+this.beneficiaryAddress+this.timestamp).toString();
    }
    signTransaction(beneficiaryEcKey) {
        console.log("Signing created Transaction");
        if(beneficiaryEcKey.getPublic('hex') != this.beneficiaryAddress){
            return 'You cannot sign transaction with another wallets!';
        }
        const hashTx = this.calculateHash();
        const sig = beneficiaryEcKey.sign(hashTx,'base64');
        this.signature  = sig.toDER('hex');
    }
    isValidTransaction(){
        if(this.projectId  === null){
            return false
        };
        if(!this.signature || this.signature.length ===0){
            console.log("No signature in this transaction");
            return false;
        }
        const publicKey  = ec.keyFromPublic(this.beneficiaryAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
    parseData(data) {
        this.projectId = data.projectId;
        this.beneficiaryAddress = data.beneficiaryAddress;
        this.timestamp = data.timestamp;
    }
}
module.exports = CreateProjectTransaction;