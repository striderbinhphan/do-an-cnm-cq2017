const Block = require('./block');
const Transaction = require('./transaction');
const charityProject  = require('./project');
const Address = require('./address');
class CharityBlockChain{
    constructor(){
        this.blocks = this.blocks||[this.createGenesisBlock()];
        this.pendingTransaction = [];
        this.addressList = [];
        this.projectList = []; 
    }
    //common block chain involved methods
    createGenesisBlock(){
        return new Block(0,Date.parse('2021-10-06')/1000,'genesisTransactions','genesisPreviousHash',3,0,'genesisHash')
    }
    getLatestBlock(){
        return this.blocks[this.blocks.length -1];
    }
    //=============create new User  involved methods
    createUser(newUser){
        this.addressList.push(newUser);
        console.log("added new User:" ,newUser);
    }   

    //============create project involved methods =============
    getSumOfProject(){
        return this.projectList.length;
    }
    isExistingProject(projectName){
        return this.projectList.map(p=>p.projectName).includes(projectName);
    }
    createProject(newProjectInfo){
        if(!this.isExistingProject(newProjectInfo.projectName)){
            const projectTemp = new charityProject(null,null,null,null,null,null);
            newProjectInfo.projectId = this.projectList.length;
            projectTemp.setInfo(newProjectInfo);
            this.projectList.push(projectTemp);
            console.log("added new Charity project:",projectTemp);
            //delete projectTemp;
        }
        else{
            console.log("This charity project has name which existing in our blockchain");
        }
    }
    //==========add transactino involved methods ===========
    addTransaction(transaction){
        if(transaction.isValidTransaction()){
            this.pendingTransaction.push(transaction);
            console.log("add transaction: ", transaction)
        }else{
            console.log("This transaction is invalid");
        }
    }
   
}
module.exports = CharityBlockChain ;
