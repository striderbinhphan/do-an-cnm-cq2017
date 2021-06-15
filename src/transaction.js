const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const CreateProjectTransaction = require('./create-project-transaction')
const ConfirmProjectTransaction = require('./confirm-project-transaction')
const DonateTransaction = require('./donate-transaction')
class Transaction {
    constructor(type, data){
       this.type = type;
       if(type === "create"){
            this.data = new CreateProjectTransaction(null,null,null);
            //data.projectId, data.beneficiaryAddress, data.timestamp
            if(data!==null){
                this.data.parseData(data);
            }
            
        }
        if(type==="confirm"){
           
            this.data = new ConfirmProjectTransaction(null,null,null,null);
            //data.projectId, data.beneficiaryAddress, data.timestamp
            if(data!==null){
                this.data.parseData(data);
            }
            
        }
        if(type==="donate"){
            this.data = new DonateTransaction(null,null,null,null,null);
            if(data!==null){
                this.data.parseData(data);
            }
           
        }
       
    }
    signTransaction(ecKey){
        
        return this.data.signTransaction(ecKey);
    }
    isValidTransaction(){
        return this.data.isValidTransaction();
    }
    
}
module.exports = Transaction;