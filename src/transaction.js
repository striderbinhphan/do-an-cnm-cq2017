const SHA256 = require("crypto-js/sha256");

const CreateProjectTransaction = require('./create-project-transaction')
const ConfirmProjectTransaction = require('./confirm-project-transaction')
const DonateTransaction = require('./donate-transaction')
class Transaction {
    constructor(type, data){
       this.type = type;
       this.data = this.dataParse(data); 
    }
    //transaction co 2 loai: CreateProjectTransaction, DonateTransaction tuy theo type de luu data tuong ung
    dataParse(data){
        if(this.type === "create"){
            return new CreateProjectTransaction(data.projectId, data.beneficiaryAddress, data.timestamp);
        }
        if(this.type==="confirm"){
            return new ConfirmProjectTransaction(data.projectId, data.organizeAddress, data.beneficiaryAddress, data.timestamp);
        }
        if(this.type==="donate"){
            return new DonateTransaction( data.projectId, data.fromAddress, data.toAddress, data.amount, data.timestamp);
        }
    }
    isValidTransaction(){
        return this.data.isValidTransaction();
    }
   
}
module.exports = Transaction;