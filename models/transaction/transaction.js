const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const CreateProjectTransaction = require('./create-project-transaction');
const ConfirmProjectTransaction = require('./confirm-project-transaction');
const DonateProjectTransaction = require('./donate-project-transaction');
const SendbackProjectTransaction = require('./sendback-project-transaction');
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
            this.data = new DonateProjectTransaction(null,null,null,null,null);
            if(data!==null){
                this.data.parseData(data);
            }
           
        }

        if(type==="sendback"){
            this.data = new SendbackProjectTransaction(null,null,null,null,null);
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
    parseData(txData){
        this.type = txData.type;
        if(txData.type === "create"){
             this.data = new CreateProjectTransaction(null,null,null);
             //data.projectId, data.beneficiaryAddress, data.timestamp
             if(txData.data!==null){
                 this.data.parseData(txData.data);
             }
             
         }
         if(txData.type==="confirm"){
            
             this.data = new ConfirmProjectTransaction(null,null,null,null);
             //data.projectId, data.beneficiaryAddress, data.timestamp
             if(txData.data!==null){
                 this.data.parseData(txData.data);
             }
             
         }
         if(txData.type==="donate"){
             this.data = new DonateProjectTransaction(null,null,null,null,null);
             if(txData.data!==null){
                 this.data.parseData(txData.data);
             }
            
         }
 
         if(txData.type==="sendback"){
             this.data = new SendbackProjectTransaction(null,null,null,null,null);
             if(txData.data!==null){
                 this.data.parseData(txData.data);
             }
            
         }
    }
}
module.exports = Transaction;