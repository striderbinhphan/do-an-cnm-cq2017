const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
class ConfirmProjectTransaction{
    constructor(projectId,projectOrganizationConfirmAddress, projectConfirmTimestamp){
        this.projectId = projectId;
        this.projectOrganizationConfirmAddress = projectOrganizationConfirmAddress;
        this.projectConfirmTimestamp = projectConfirmTimestamp;
    }
    
    calculateHash(){
        return SHA256(this.projectId+this.projectOrganizationConfirmAddress+this.projectConfirmTimestamp).toString();
    }
    signTransaction(organizationEcKey){
        console.log("signing confirm transaction");
        if(organizationEcKey.getPublic('hex') != this.projectOrganizationConfirmAddress){
            console.log('You cannot sign transaction with another wallets!');
            return false;
        }
        const hashTx = this.calculateHash();
        const sig = organizationEcKey.sign(hashTx,'base64');
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
        const publicKey  = ec.keyFromPublic(this.projectOrganizationConfirmAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
    parseData(data) {
        this.projectId = data.projectId;
        this.projectOrganizationConfirmAddress = data.projectOrganizationConfirmAddress;
        this.projectConfirmTimestamp = data.projectConfirmTimestamp;
    }
}
module.exports = ConfirmProjectTransaction;