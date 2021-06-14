const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
class ConfirmProjectTransaction{
    constructor(projectId,organizeAddress, beneficiaryAddress,timestamp){
        this.projectId = projectId;
        this.organizeAddress = organizeAddress;
        this.beneficiaryAddress = beneficiaryAddress;
        this.timestamp = timestamp;
        this.hash = this.calculateHash();
    }
    calculateHash = () =>{
        return SHA256(this.projectId+this.organizeAddress+this.beneficiaryAddress+this.timestamp);
    }
    signTransaction = (organizeEcKey) => {
        if(organizeEcKey.getPublic('hex') != this.organizeAddress){
            console.log('You cannot sign transaction with another wallets!')
            return false;
        }
        const sig = organizeEcKey.sign(hashTx,'base64');
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
        return publicKey.verify(this.hash,this.signature);
    }
}
module.exports = ConfirmProjectTransaction;