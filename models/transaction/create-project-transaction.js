const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
class CreateProjectTransaction{
    constructor(projectId,projectBeneficiaryCreateAddress, projectCreateTimestamp){
        this.projectId = projectId;
        this.projectBeneficiaryCreateAddress = projectBeneficiaryCreateAddress;
        this.projectCreateTimestamp = projectCreateTimestamp;
    }

    calculateHash(){
        return SHA256(this.projectId+this.projectBeneficiaryCreateAddress+this.projectCreateTimestamp).toString();
    }
    signTransaction(beneficiaryEcKey) {
        console.log("Signing created Transaction");
        if(beneficiaryEcKey.getPublic('hex') != this.projectBeneficiaryCreateAddress){
            console.log('You cannot sign transaction with another wallets!')
            return false;
        }
        const hashTx = this.calculateHash();
        const sig = beneficiaryEcKey.sign(hashTx,'base64');
        this.signature  = sig.toDER('hex');
        return true;
    }
    isValidTransaction(){
        if(this.projectId  === null){
            return false
        };
        if(!this.signature || this.signature.length ===0){
            console.log("No signature in this transaction");
            return false;
        };
        const publicKey  = ec.keyFromPublic(this.projectBeneficiaryCreateAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
    parseData(data) {
        this.projectId = data.projectId;
        this.projectBeneficiaryCreateAddress = data.projectBeneficiaryCreateAddress;
        this.projectCreateTimestamp = data.projectCreateTimestamp;
    }
}
module.exports = CreateProjectTransaction;