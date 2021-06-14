const Block = require('./block');
const Transaction = require('./transaction');
const Project  = require('./project')
const Address = require('./address');
class CharityBlockChain{
    constructor(){
        this.blocks = this.blocks||[this.createGenesisBlock()];
        this.pendingTransaction = [];
        this.addressList = [];
        this.projectList = []; 
    }
    createGenesisBlock(){
        return new Block(0,Date.parse('2021-10-06')/1000,'genesisTransactions','genesisPreviousHash',3,0,'genesisHash')
    }
    getLatestBlock(){
        return this.blocks[this.blocks.length -1];
    }
    addProject(newProject){
        this.projectList.push(new Project( this.projectList.length, newProject.projectName, newProject.projectBeneficiaryCreateAddress, newProject.projectDescription));
    }
    createUser(name,role){
        const user = new Address();
        user.generateKeyPair(name,role);
        this.addressList.push(user);
        //console.log(user.address);
        //return user.address;
    }
    getAddress(name){
       return this.addressList.filter(c=>c.name===name).reduce((a,b)=>a);
    }
    addTransaction(type, data){
        const newTxs = new Transaction(type,data);
        this.pendingTransaction.push(newTxs);
        console.log("add transaction: ", newTxs)
    }
}
module.exports = CharityBlockChain ;
