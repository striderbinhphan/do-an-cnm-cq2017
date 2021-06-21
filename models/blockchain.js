const Block = require('./block');
const Transaction = require('./transaction/transaction');
const charityProject  = require('./project/project');
const Address = require('./address/address');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const fork = require('../utils/global');
const {transactions, constants}  = require('../utils/constants');
const {calculateHash, hashMatchesDifficulty, calculateHashFromBlock} = require('../utils/common-function');
const blockchainModel = require('./blockchain.model');
class CharityBlockChain{//blockchain services
    constructor(io, blocks){
        
        this.difficulty = 3;//dokho
        this.io = io;//socketioserver



        this.blocks = [];//blocks
        this.pendingTransactions = [];//nhung transaction chua duoc mine
        this.addressList = [];//danh sach account trong blockchain
        this.projectList = []; //project in charityBlocckchain
        this.nodes = [];//node connecting


        this.fetchBlocksData();
        this.fetchUsersData();
        this.fetchProjectsData();
        //this.fetchNodesData();
        this.fetchPendingTransactionData();
        

        
        //mining variables
        this.transactionBuffer = null;//danh sach transaction chuan bi mine
        this.blockBuffer = null; //luu tru danh sach block send di trong p2p 
        this.isConfirm = false;//block buffer save block from other node to adding this blockchain
        this.miningStatus =false; //trang thai mining cua blockchain
        this.confirm = 0 ;
        this.deny = 0;
    }
    async fetchBlocksData(){
        //doc du lieu block chain vao bien tam
        const blocksFromDB =  await blockchainModel.all();
        // const blockIndexList = blocksFromDB.map((b)=>b.block_index).map(async(index) =>{
        //     const transactionInBlock = await blockchainModel.getTransactionByBlockIndex(index);
        //     console.log(transactionInBlock);
        // });
        //console.log(blocksFromDB);
        const blockIndexList = blocksFromDB.map(async(b) =>{
            const transactionInBlock = await blockchainModel.getTransactionByBlockIndex(b.block_index);

            const block = new Block(b.block_index,b.block_timestamp,transactionInBlock,b.block_previoushash,b.block_nonce,b.block_difficulty,b.block_hash);
            //console.log(block);
            this.blocks.push(block);
        });
        
        //doc du lieu user vao bien tam
    }
    //common block chain involved methods
    //  createGenesisBlock(){
    //     // const txsInBlock = await blockchainModel.getTransactionByBlockIndex(0);
    //     // console.log(txsInBlock);
    //     return new Block(0,Date.parse('2021-10-06')/1000,'genesisTransactions','0',0,0,'genesisHash');
    // }
    async fetchUsersData(){
        const userList = await blockchainModel.getUserList();
        console.log(userList);
        userList.map(u=>this.addressList.push(u));
    }

    async fetchProjectsData(){
        const projectList = await blockchainModel.getProjectList();
        console.log(projectList);
        projectList.map(p=>this.projectId.push(p));
    }

    // async fetchPendingTransactionData(){
    //     const pendingTransactionsList = await blockchainModel.getPendingTransactions();
    //     console.log(pendingTransactionsList);
    //     pendingTransactionsList.map(c=> this.pendingTransactions.push(c));
    // }

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
    getBeneficiaryAddressFromProjectId(projectId){

        return this.projectList[projectId].projectBeneficiaryCreateAddress;
    }

    getUserList(){
        return this.addressList;
    }
    getPendingTransactions(){
        return this.pendingTransactions;
    }
    //====blockchain methods control
    addNode(node) {
        this.nodes.push(newNode);
        blockchainModel.addNode(newNode);
    }
    //=============create new User  involved methods
    async createUser(newUser){
        this.addressList.push(newUser);
        return await blockchainModel.addNewUser(newUser);
        //console.log("added new User:" ,newUser);
    }   
    isUserExisting(publicKey){
        return this.addressList.map((ad)=>ad.address).includes(publicKey);
    }
    getUserInfo(publicKey){
        return this.addressList[this.addressList.map((ad)=>ad.address).indexOf(publicKey)];
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
    isExistingUser(projectBeneficiaryCreateAddress){
        return this.addressList.map(u=>u.address).includes(projectBeneficiaryCreateAddress);
    }
    async createProject(newProjectInfo,ecKey){
        if(!this.isExistingUser(newProjectInfo.projectBeneficiaryCreateAddress)){
            console.log("User address isn't existing in our system, pls register!");
            return false;
        }
        if(!this.isExistingProjectByName(newProjectInfo.projectName)){
            //vi project moi nen chua co id trong he thong
            newProjectInfo.projectId = this.projectList.length;
            //tao transactino create
            const createdTxs = new Transaction("create",newProjectInfo);//CreateProjectTransaction
            //kiem tra neu ky vao giao dich that bai
            if(createdTxs.signTransaction(ecKey)){
                if(await this.addTransaction(createdTxs)){
                    this.io.emit(transactions.ADD_TRANSACTION,createdTxs);
                    const projectTemp = new charityProject(null,null,null,null,null,null,null);
                    projectTemp.setInfo(newProjectInfo);
                    this.projectList.push(projectTemp);
                    //=================luu database project
                    blockchainModel.addProject(projectTemp);
                    //projectId
                    console.log("created Project:",projectTemp);
                    //console.log("project list",this.projectList);
                    return true;
                } else{
                    console.log("This transaction is invalid(matched add & privateKey)");
                    return false;
                }
            }
            else{
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
        if(!this.isExistingUser(newProjectInfo.projectOrganizationConfirmAddress)){
            console.log("User address isn't existing in our system, pls register!");
            return false;
        }
        if(this.isExistingProjectById(projectInfo.projectId)&& this.projectList[projectInfo.projectId].projectOrganizationConfirmAddress===null){
           
            const confirmTxs = new Transaction("confirm",projectInfo);
            if(confirmTxs.signTransaction(confirmEcKey)){
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
        if(!this.isExistingUser(newProjectInfo.fromAddress)||!this.isExistingUser(newProjectInfo.toAddress)){
            console.log("User address isn't existing in our system, pls register!");
            return false;
        }
        if(this.isExistingProjectById(donateInfo.projectId)){
           if(this.verifyDonateTimestamp(donateInfo.projectId,donateInfo.donateTimestamp)){
                const donateTxs = new Transaction("donate",donateInfo);
                if(donateTxs.signTransaction(donaterEcKey)){
                    if(await this.addTransaction(donateTxs)){
                        console.log("donate transaction is made");
                        this.io.emit(transactions.ADD_TRANSACTION,donateTxs);
                        
                        return true;
                    } else{
                        console.log("This transaction is invalid(matched add & privateKey)");
    
                        return false;
                    }
                }else{
                    console("signing transaction fail");
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
        if(!this.isExistingUser(newProjectInfo.fromAddress)||!this.isExistingUser(newProjectInfo.toAddress)){
            console.log("User address isn't existing in our system, pls register!");
            return false;
        }
        if(this.isExistingProjectById(sendbackInfo.projectId)){
            if(this.projectList[sendbackInfo.projectId].projectOrganizationConfirmAddress!==sendbackInfo.fromAddress ||
                this.projectList[sendbackInfo.projectId].projectBeneficiaryCreateAddress!==sendbackInfo.toAddress){
                console.log(`From address must be ${this.projectList[sendbackInfo.projectId].projectOrganizationConfirmAddress}`);
                console.log(`To address must be ${this.projectList[sendbackInfo.projectId].projectBeneficiaryCreateAddress}`);

                return false;
            }else{
                const sendbackTxs = new Transaction("sendback",sendbackInfo);
                if(sendbackTxs.signTransaction(orgaEcKey)){
                    if(await this.addTransaction(sendbackTxs)){
                        this.io.emit(transactions.ADD_TRANSACTION,sendbackTxs);
                        return true;
                    } else{
                    console.log("This transaction is invalid(matched add & privateKey)");
                        return false;
                    }
                }else{
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
            this.transactionBuffer = this.pendingTransactions.splice(0, spliceNumber);//1 //pendingtxs :5 => 1
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
            }//mining service
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
        this.reset();//note 
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
            //save database
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
