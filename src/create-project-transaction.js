const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
class CreateProjectTransaction{
    constructor(projectId,beneficiaryAddress, timestamp){
        this.projectId = projectId;
        this.beneficiaryAddress = beneficiaryAddress;
        this.timestamp = timestamp;
        this.hash = this.calculateHash();
    }
    calculateHash = () =>{
        return SHA256(this.projectId+this.beneficiaryAddress+this.timestamp);
    }
    signTransaction = (beneficiaryEcKey) => {
        if(beneficiaryEcKey.getPublic('hex') != this.beneficiaryAddress){
            return 'You cannot sign transaction with another wallets!';
        }
        const sig = beneficiaryEcKey.sign(this.hash,'base64');
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
        return publicKey.verify(this.hash,this.signature);
    }
}
module.exports = CreateProjectTransaction;