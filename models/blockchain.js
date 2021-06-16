const Block = require('./block');
const Transaction = require('./transaction/transaction');
const charityProject  = require('./project/project');
const Address = require('./address/address');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const fork = require('../utils/global');
const {transactions, constants}  = require('../utils/constants');
const {calculateHash, hashMatchesDifficulty, calculateHashFromBlock} = require('../utils/common-function');
class CharityBlockChain{
    constructor(io, blocks){
        this.difficulty = 3;//dokho
        this.blocks = blocks||[this.createGenesisBlock()];//blocks
        this.pendingTransactions = [];//nhung transaction chua duoc mine
        this.addressList = [];//danh sach account trong blockchain
        this.projectList = []; //project in charityBlocckchain
        this.nodes = [];//node connecting
        this.io = io;//socketioserver
        //mining variables
        this.transactionBuffer = null;//danh sach transaction chuan bi mine
        this.blockBuffer = null; //luu tru danh sach block send di trong p2p 
        this.miningStatus =false; //trang thai mining cua blockchain
        this.isConfirm = false;//block buffer save block from other node to adding this blockchain
        this.confirm = 0 ;
        this.deny = 0;
    }
    //common block chain involved methods
    createGenesisBlock(){
        return new Block(0,Date.parse('2021-10-06')/1000,'genesisTransactions','0',0,0,'genesisHash');
    }
    getLatestBlock(){
        return this.blocks[this.blocks.length -1];
    }
    getLength(){
        return this.blocks.length();
    }
    getBlocks(){
        return this.blocks;
    }
    getProjectList(){
        return this.projectList;
    }
    getUnconfirmProjectList(){
        return this.projectList.filter(c=>c.projectOrganizationConfirmAddress===null);
    }
    getDonateProjectList(){
        const currentDate = new Date().getTime();
        return this.projectList.filter(c=>(c.projectOrganizationConfirmAddress!==null&&c.projectDeadline>=currentDate));
    }
    getOrganizationConfirmAddressFromProjectId(projectId){
        console.log()
        return this.projectList[projectId].projectOrganizationConfirmAddress;
    }
    getUserList(){
        return this.addressList;
    }
    getPendingTransactions(){
        return this.pendingTransactions;
    }
    //====blockchain methods control
    addNode(node) {
        this.nodes.push(node);
    }
    //=============create new User  involved methods
    createUser(newUser){
        this.addressList.push(newUser);
        //console.log("added new User:" ,newUser);
    }   
    isUserExisting(publicKey){
        return this.addressList.map((ad)=>ad.address).includes(publicKey);
    }
    //============create project involved methods =============
    getSumOfProject(){
        return this.projectList.length;
    }
   
    isExistingProjectByName(projectName){
        return this.projectList.map(p=>p.projectName).includes(projectName);
    }
    isExistingProjectById(projectId){
        return this.projectList.map(p=>p.projectId).includes(projectId);
    }
    async createProject(newProjectInfo,ecKey){
        if(!this.isExistingProjectByName(newProjectInfo.projectName)){
            const projectTemp = new charityProject(null,null,null,null,null,null,null);
            newProjectInfo.projectId = this.projectList.length;
            projectTemp.setInfo(newProjectInfo);
            this.projectList.push(projectTemp);
            console.log("created Project:",projectTemp);
            //console.log("project list",this.projectList);

            const createdTxs = new Transaction("create",newProjectInfo);
            createdTxs.signTransaction(ecKey);
            if(await this.addTransaction(createdTxs)){
                this.io.emit(transactions.ADD_TRANSACTION,createdTxs);
                return true;
            } else{
                console.log("This transaction is invalid(matched add & privateKey)");
                this.projectList.splice(this.projectList.length -1, 1);
                return false;
            }

        }
        else{
            console.log("This charity project has name which existing in our blockchain");
            return false;
        }
    }
    //===========confirm project involved methods 
    async confirmProject(projectInfo,confirmEcKey){
        if(this.isExistingProjectById(projectInfo.projectId)&& this.projectList[projectInfo.projectId].projectOrganizationConfirmAddress===null){
           
            const confirmTxs = new Transaction("confirm",projectInfo);
            confirmTxs.signTransaction(confirmEcKey);
            if(await this.addTransaction(confirmTxs)){ 
                this.io.emit(transactions.ADD_TRANSACTION,confirmTxs);

                this.projectList[projectInfo.projectId].projectOrganizationConfirmAddress = confirmEcKey.getPublic('hex');
                this.projectList[projectInfo.projectId].projectConfirmTimestamp = projectInfo.projectConfirmTimestamp;

                //delete projectTemp;
                return true;
            }else{
                console.log("This transaction is invalid(matched add & privateKey)");

                return false;
            }
        }
        else{
            console.log("This charity project has id which existing in our blockchain & this charity project has been confirmed");
            return false;
        }
    }
    //============sending money from donate => organization or organization to beneficiary
    verifyDonateTimestamp(projectId, donateTimestamp){
        if(this.projectList[projectId].projectConfirmTimestamp<=donateTimestamp && donateTimestamp<=this.projectList[projectId].projectDeadline){
            return true;
        }
        else{
            console.log("This charity project is expired to donate. Comback when deadline is extended");
            return false;
        }
    }
    async donateProject(donateInfo,donaterEcKey){
        if(this.isExistingProjectById(donateInfo.projectId)){
           if(this.verifyDonateTimestamp(donateInfo.projectId,donateInfo.donateTimestamp)){
                const donateTxs = new Transaction("donate",donateInfo);
                donateTxs.signTransaction(donaterEcKey);
                if(await this.addTransaction(donateTxs)){
                    this.io.emit(transactions.ADD_TRANSACTION,donateTxs);
                    
                    return true;
                } else{
                    console.log("This transaction is invalid(matched add & privateKey)");

                    return false;
                }
           }else{
               return false;
           }
           
        }
        else{
            console.log("This charity project has id which existing in our blockchain");
            return false;
        }
    }
     //============sending money from donate => organization or organization to beneficiary
    async sendbackProject(sendbackInfo,orgaEcKey){
        if(this.isExistingProjectById(sendbackInfo.projectId)){
            if(this.projectList[sendbackInfo.projectId].projectOrganizationConfirmAddress!==sendbackInfo.fromAddress ||
                this.projectList[sendbackInfo.projectId].projectBeneficiaryCreateAddress!==sendbackInfo.toAddress){
                console.log(`From address must be ${this.projectList[sendbackInfo.projectId].projectOrganizationConfirmAddress}`);
                console.log(`To address must be ${this.projectList[sendbackInfo.projectId].projectBeneficiaryCreateAddress}`);

                return false;
            }else{
                const sendbackTxs = new Transaction("sendback",sendbackInfo);
                sendbackTxs.signTransaction(orgaEcKey);
                if(await this.addTransaction(sendbackTxs)){
                    this.io.emit(transactions.ADD_TRANSACTION,sendbackTxs);
                    return true;
                } else{
                console.log("This transaction is invalid(matched add & privateKey)");
                    return false;
                }
            }
        }
        else{
            console.log("This charity project has id which existing in our blockchain");
            return false;
        }
    }
    //==========add transactino involved methods ===========
    async addTransaction(transaction){
        if(transaction.isValidTransaction()){
            this.pendingTransactions.push(transaction);
            console.log("added transaction: ", transaction)
            await this.miningBlock();
            return true;
        }else{
            console.log("This transaction is invalid");
            return false;
        }
    }
    async miningBlock(){
        if (this.pendingTransactions.length >= constants.TRANSACTIONS_IN_BLOCK && !this.miningStatus) {//1
            this.miningStatus = true;
            let spliceNumber =
              this.pendingTransactions.length >= constants.TRANSACTIONS_IN_BLOCK//3
                ? constants.TRANSACTIONS_IN_BLOCK
                : this.pendingTransactions.length;
                console.log(spliceNumber);
            this.transactionBuffer = this.pendingTransactions.splice(0, spliceNumber);//1
            //console.log("after splice==============",this.pendingTransactions);
            console.info("Starting mining block...");
            const previousBlock = this.getLatestBlock();
            //console.log(previousBlock);
            const transactionsInBlock = this.transactionBuffer.map((txData) => {
              let transaction = new Transaction(null,null);
              transaction.parseData(txData);
              return transaction;
            });
            const currentTimestamp = Math.round(new Date().getTime()/1000);

            const blockObj = {
                index: previousBlock.getIndex() + 1,
                timestamp: currentTimestamp,
                transactions: transactionsInBlock,
                previousHash: previousBlock.hash,
                difficulty: this.difficulty
            }
            fork().send(blockObj);
            fork().on("message", (nonce) => {
              let block = new Block(blockObj.index,blockObj.timestamp,blockObj.transactions,
                blockObj.previousHash,nonce,blockObj.difficulty);
                //console.log(block);
                this.mineBlock(block);
            });
          }
    }
    mineBlock(block){
        this.blocksBuffer = block;
        this.confirm++;
        this.reset();
        console.log("Mined Successfully");
        let tempChain = this.getBlocks();
        tempChain.push(block);
        console.log(tempChain);
        this.io.emit(transactions.END_MINING, {
            blocks: tempChain,
        });
    }
    reset(){
        this.deny = 0;
        this.confirm = 0;
        this.isConfirm = false;
    }
    
    //=======p2p model interaction ============
    parseChain(blocks) {
        this.blocks = blocks.map((block) => {
        const parsedBlock = new Block(null,null,null,null,null,null,null);
        parsedBlock.parseBlock(block);
        return parsedBlock;
        });
    }
    checkValidity() {
        const { blocks } = this;
        let previousBlock = blocks[0];
        for (let index = 1; index < blocks.length; index++) {
          const currentBlock = blocks[index];
          if (currentBlock.previousHash !== previousBlock.hash) {
            return false;
          }
          if (!hashMatchesDifficulty(calculateHashFromBlock(currentBlock))&&calculateHashFromBlock(currentBlock)!==currentBlock.hash) {
            return false;
          }
          if (currentBlock.index !== index) {
            return false;
          }
          previousBlock = currentBlock;
        }
        return true;
    }
    compareCurrentBlock(otherBlocks){
        const { blocks } = this;
        if (otherBlocks.length !== blocks.length + 1) {
            console.log("Wrong block length");
            return false;
        }

        for (let index = 0; index < blocks.length; index++) {
            if (blocks[index].hash !== otherBlocks[index].hash) {
                console.log("Wrong block hash");
                console.log(blocks[index]);
                console.log(otherBlocks[index]);
                return false;
            }
        }
        let newBlockTransactions = otherBlocks[otherBlocks.length - 1].transactions;

        for (let index1 = 0; index1 < this.actionBuffer.length; index1++) {
            if (
                newBlockTransactions[index1] !== this.transactionBuffer[index1]
            ) {
                console.log("Wrong transaction");
                console.log(newBlockTransactions[index1]);
                console.log(this.transactionBuffer[index1]);
                return false;
            }
        }

        let newBlock = otherBlocks.splice(otherBlocks.length - 1, 1);
        this.blocksBuffer = newBlock[0];
        return true;
    }
    confirmBlock() {
        console.log("Someone confirm");
        if (!this.isConfirm) {
          this.confirm++;
          let totalNodes = this.nodes.length + 1;
          if (this.confirm >= totalNodes / 2) {
            console.log("Enough confirm");
            this.miningStatus = false;
            this.confirm = 0;
            const tempBlock = new Block(null,null,null,null,null,null,null);
            tempBlock.parseBlock(this.blocksBuffer);
            this.blocks.push(tempBlock);
            this.blocksBuffer = null;
            this.transactionBuffer = null;
            this.isConfirm = true;
            this.miningBlock();
          }
        }
    }
    denyBlock(){
        console.log("Someone deny");
        if (!this.isConfirm) {
          this.deny++;
          let totalNodes = this.nodes.length + 1;
          if (this.deny >= totalNodes / 2) {
            console.log("Enough deny");
            this.miningStatus = false;
            this.deny = 0;
            this.blocksBuffer = null;
            this.isConfirm = true;
            this.reMiningBlock();
          }
        }
    }
    async reMiningBlock() {
        console.info("Starting mining block...");
        const previousBlock = this.lastBlock();
        //process.env.BREAK = false;
        const transactionsInBlock = this.transactionBuffer.map((txData) => {
          let tx = new Transaction(null,null);
          tx.parseData(txData);
          return tx;
        });
        const blockObj = {
            index: previousBlock.getIndex() + 1,
            timestamp: currentTimestamp,
            transactions: transactionsInBlock,
            previousHash: previousBlock.hash,
            difficulty: this.difficulty
        }
        fork().send(blockObj);
        fork().on("message", (nonce) => {
          let block = new Block(blockObj.index,blockObj.timestamp,blockObj.transactions,
            blockObj.previousHash,nonce,blockObj.difficulty);
            //console.log(block);
            this.mineBlock(block);
        });
    }
}
module.exports = CharityBlockChain ;
