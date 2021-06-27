const Block = require('./block');
const Transaction = require('./transaction/transaction');
const charityProject  = require('./project/project');
const Address = require('./address/address');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const fork = require('../utils/global');
const {transactions, constants}  = require('../utils/constants');
const {calculateHash, hashMatchesDifficulty, calculateHashFromBlock , getFormattedDate, getTimestamp} = require('../utils/common-function');
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
            //console.log(transactionInBlock);
            const transactions = transactionInBlock.map((txs)=>(this.getTransactionInBlockFromDatabase(txs)));
            const block = new Block(b.block_index,getFormattedDate(b.block_timestamp),transactions,b.block_previoushash,b.block_nonce,b.block_difficulty,b.block_hash);
            //console.log(block);
            this.blocks.push(block);
        });
        
    }
    getTransactionInBlockFromDatabase(transaction){
        let objData = null;
        if(transaction.transaction_type === "create"){
            objData ={
                projectId: transaction.project_id,
                projectBeneficiaryCreateAddress : transaction.create_txs_project_beneficiary_create_address,
                projectCreateTimestamp : getFormattedDate(transaction.create_txs_project_create_timestamp),
                signature : transaction.transaction_signature,
            }
            const createdTxs = new Transaction("create",objData);
            console.log(createdTxs);
            return createdTxs;
        }
        if(transaction.transaction_type==="confirm"){
        
            objData ={
                projectId: transaction.project_id,
                projectOrganizationConfirmAddress: transaction.confirm_txs_project_organization_confirm_address,
                projectConfirmTimestamp: getFormattedDate(transaction.confirm_txs_project_confirm_timestamp),
                signature: transaction.transaction_signature
            }
            const confirmedTxs = new Transaction("confirm",objData);
            console.log(confirmedTxs);
            return confirmedTxs;
        }
        if(transaction.transaction_type==="donate"){
            objData ={
                projectId: transaction.projectId,
                fromAddress: transaction.donate_txs_from_address,
                toAddress: transaction.donate_txs_to_address,
                amount: transaction.donate_txs_amount,
                donateTimestamp: getFormattedDate(transaction.donate_txs_timestamp),
                signature: transaction.transaction_signature
            }
            const donatedTxs = new Transaction("donate",objData);
            console.log(donatedTxs);
            
            return donatedTxs;
        }

        if(transaction.transaction_type==="sendback"){
            objData ={
                projectId: transaction.project_id,
                fromAddress: transaction.sendback_txs_from_address,
                toAddress: transaction.sendback_txs_to_address,
                amount: transaction.sendback_txs_amount,
                sendbackTimestamp: getFormattedDate(transaction.sendback_txs_timestamp),
                signature: transaction.transaction_signature
            }
            const sendbackTxs = new Transaction("sendback",objData);
            console.log(sendbackTxs);

            return sendbackTxs;
        }
        if(transaction.transaction_type==="genesis"){
            objData ={
                type: "genesis",
                data:{ 
                    projectId: transaction.project_id,
                    signature: transaction.transaction_signature
                }
            }
            
            return objData;
        }
    }
    //common block chain involved methods
    //  createGenesisBlock(){
    //     // const txsInBlock = await blockchainModel.getTransactionByBlockIndex(0);
    //     // console.log(txsInBlock);
    //     return new Block(0,Date.parse('2021-10-06')/1000,'genesisTransactions','0',0,0,'genesisHash');
    // }
    async fetchUsersData(){
        const userList = await blockchainModel.getUserList();
        //console.log(userList);
        userList.map(u=>this.addressList.push(u));
    }

    async fetchProjectsData(){
        const projectList = await blockchainModel.getProjectList();
        //console.log(projectList);
        projectList.map(p=>this.projectList.push({
            projectId:p.project_id,
            projectName: p.project_name,
            projectBeneficiaryCreateAddress: p.project_beneficiary_create_address,
            projectOrganizationConfirmAddress: p.project_organization_confirm_address,
            projectDescription: p.project_description,
            projectCreateTimestamp:getFormattedDate(p.project_create_timestamp),
            projectConfirmTimestamp: getFormattedDate(p.project_confirm_timestamp),
            projectDeadline:getFormattedDate(p.project_deadline)
        }));
    }

    async fetchNodesData(){
        const nodeList = await blockchainModel.getNodeList();
        //console.log(nodeList);
        nodeList.map(n=>this.nodes.push(n));
    }

    async fetchPendingTransactionData(){
        const pendingTransactionsList = await blockchainModel.getPendingTransactions();
        pendingTransactionsList.map(pTxs=> {
            this.getPendingTransactionFromDatabase(pTxs);
        });
    }
    getPendingTransactionFromDatabase(transaction){
        let objData = null;
        if(transaction.transaction_type === "create"){
            objData ={
                projectId: transaction.project_id,
                projectBeneficiaryCreateAddress : transaction.create_txs_project_beneficiary_create_address,
                projectCreateTimestamp : getFormattedDate(transaction.create_txs_project_create_timestamp),
                signature : transaction.transaction_signature,
            }
            const createdTxs = new Transaction("create",objData);
            this.pendingTransactions.push(createdTxs);
           
        }
        if(transaction.transaction_type==="confirm"){
        
            objData ={
                projectId: transaction.project_id,
                projectOrganizationConfirmAddress: transaction.confirm_txs_project_organization_confirm_address,
                projectConfirmTimestamp: getFormattedDate(transaction.confirm_txs_project_confirm_timestamp),
                signature: transaction.transaction_signature
            }
            const confirmedTxs = new Transaction("confirm",objData);
            this.pendingTransactions.push(confirmedTxs);
        }
        if(transaction.transaction_type==="donate"){
            objData ={
                projectId: transaction.projectId,
                fromAddress: transaction.donate_txs_from_address,
                toAddress: transaction.donate_txs_to_address,
                amount: transaction.donate_txs_amount,
                donateTimestamp: getFormattedDate(transaction.donate_txs_timestamp),
                signature: transaction.transaction_signature
            }
            const donatedTxs = new Transaction("donate",objData);
            this.pendingTransactions.push(donatedTxs);
        }

        if(transaction.transaction_type==="sendback"){
            objData ={
                projectId: transaction.project_id,
                fromAddress: transaction.sendback_txs_from_address,
                toAddress: transaction.sendback_txs_to_address,
                amount: transaction.sendback_txs_amount,
                sendbackTimestamp: getFormattedDate(transaction.sendback_txs_timestamp),
                signature: transaction.transaction_signature
            }
            const sendbackTxs = new Transaction("sendback",objData);
            this.pendingTransactions.push(sendbackTxs);
        }
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
    getConfirmProjectList(){
        return this.projectList.filter(c=>c.projectOrganizationConfirmAddress!==null);
    }
    getDonateProjectList(){
        const currentDate = new Date().getTime();
        return this.projectList.filter(c=>(c.projectOrganizationConfirmAddress!==null&&getTimestamp(c.projectDeadline)>=currentDate));
    }
    getSendbackProjectList(){
        const currentDate = new Date().getTime();
        return this.projectList.filter(c=>(c.projectOrganizationConfirmAddress!==null&&getTimestamp(c.projectDeadline)<=currentDate));
    }
    getOrganizationConfirmAddressFromProjectId(projectId){
        const index = projectId -1;
        console.log()
        return this.projectList[index].projectOrganizationConfirmAddress;
    }
    getBeneficiaryAddressFromProjectId(projectId){
        const index = projectId -1;
        return this.projectList[index].projectBeneficiaryCreateAddress;
    }

    getNodeList(){
        return this.nodes;
    }

    getNodeList(){
        return this.nodes;
    }

    getUserList(){
        return this.addressList;
    }
    getPendingTransactions(){
        return this.pendingTransactions;
    }
    //====blockchain methods control
    addNode(newNode) {
        this.nodes.push(newNode);
        blockchainModel.addNode(newNode);
    }
    //=============create new User  involved methods
    async createUser(newUser){
        if(!this.isUserExisting(newUser.address)){
            this.io.emit(transactions.ADD_USER, newUser);
            this.addressList.push(newUser);
            return await blockchainModel.addNewUser(newUser);
            //console.log("added new User:" ,newUser);
        }
        else{
            throw new Error("this user is created before");
        }
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
            newProjectInfo.projectId = this.projectList.length+1;
            //tao transactino create
            const createdTxs = new Transaction("create",newProjectInfo);//CreateProjectTransaction
            //kiem tra neu ky vao giao dich that bai
            if(createdTxs.signTransaction(ecKey)){
                if(await this.addTransaction(createdTxs)){
                    this.io.emit(transactions.ADD_TRANSACTION,createdTxs);
                    const projectTemp = new charityProject(null,null,null,null,null,null,null);
                    projectTemp.setInfo(newProjectInfo);
                    this.projectList.push(projectTemp);
                    console.log(projectTemp);

                    //bien luu gia tri luu vao db
                    const projectDbObj = {
                        project_id: null,
                        project_name: projectTemp.projectName,
                        project_beneficiary_create_address: projectTemp.projectBeneficiaryCreateAddress,
                        project_organization_confirm_address: projectTemp.projectOrganizationConfirmAddress,
                        project_description: projectTemp.projectDescription,
                        project_create_timestamp: projectTemp.projectCreateTimestamp,
                        project_confirm_timestamp: projectTemp.projectConfirmTimestamp,
                        project_deadline: projectTemp.projectDeadline
                    }
                    //=================luu database project
                    const addProjectResult = await blockchainModel.addProject(projectDbObj);
                    console.log("created Project:",addProjectResult);
                    this.io.emit(transactions.ADD_PROJECT, projectDbObj);
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
    async addProject(projectDbObj){
        return await blockchainModel.addProject(projectDbObj);
    }
    //===========confirm project involved methods 
    async confirmProject(projectInfo,confirmEcKey){
        const projectIndex = projectInfo.projectId -1;
        if(!this.isExistingUser(projectInfo.projectOrganizationConfirmAddress)){
            console.log("User address isn't existing in our system, pls register!");
            return false;
        }
        if(this.isExistingProjectById(projectInfo.projectId)&& this.projectList[projectIndex].projectOrganizationConfirmAddress===null){
           
            const confirmTxs = new Transaction("confirm",projectInfo);
            if(confirmTxs.signTransaction(confirmEcKey)){
                if(await this.addTransaction(confirmTxs)){ 
                    this.io.emit(transactions.ADD_TRANSACTION,confirmTxs);
    
                    this.projectList[projectIndex].projectOrganizationConfirmAddress = confirmEcKey.getPublic('hex');
                    this.projectList[projectIndex].projectConfirmTimestamp = projectInfo.projectConfirmTimestamp;
                    //update data to database
                    await blockchainModel.updateConfirmAddress(projectInfo.projectId,confirmEcKey.getPublic('hex'),projectInfo.projectConfirmTimestamp);
                    const confirmData = {
                        projectId: projectInfo.projectId,
                        confirmAddress:confirmEcKey.getPublic('hex'),
                        confirmTimestamp: projectInfo.projectConfirmTimestamp
                    }
                    this.io.emit(transactions.CONFIRM_PROJECT, confirmData);
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
    async updateProject(confirmData){
        return await blockchainModel.updateConfirmAddress(confirmData.projectId,confirmData.confirmAddress,confirmData.confirmTimestamp);
    }
    //============sending money from donate => organization or organization to beneficiary
    verifyDonateTimestamp(projectId, donateTimestamp){
        const index = projectId -1;
        if(getTimestamp(this.projectList[index].projectConfirmTimestamp)<=getTimestamp(donateTimestamp) && getTimestamp(donateTimestamp)<=getTimestamp(this.projectList[index].projectDeadline)){
            return true;
        }
        else{
            console.log("This charity project is expired to donate. Comback when deadline is extended");
            return false;
        }
    }
    async donateProject(donateInfo,donaterEcKey){
        if(!this.isExistingUser(donateInfo.fromAddress)||!this.isExistingUser(donateInfo.toAddress)){
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
        const index = sendbackInfo.projectId -1;
        if(!this.isExistingUser(sendbackInfo.fromAddress)||!this.isExistingUser(sendbackInfo.toAddress)){
            console.log("User address isn't existing in our system, pls register!");
            return false;
        }
        if(this.isExistingProjectById(sendbackInfo.projectId)){
            if(this.projectList[index].projectOrganizationConfirmAddress!==sendbackInfo.fromAddress ||
                this.projectList[index].projectBeneficiaryCreateAddress!==sendbackInfo.toAddress){
                console.log(`From address must be ${this.projectList[index].projectOrganizationConfirmAddress}`);
                console.log(`To address must be ${this.projectList[index].projectBeneficiaryCreateAddress}`);

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
            console.log(transaction);
            
            const result = await this.addTransactionToPendingTransactionDatabase(transaction);
            console.log("added transaction: ", result)
            await this.miningBlock();
            return true;
        }else{
            console.log("This transaction is invalid");
            return false;
        }
    }
    async addTransactionToPendingTransactionDatabase(transaction){
        console.log("test function", transaction);
        let transactionDBObj = null;
        if(transaction.type === "create"){
             transactionDBObj ={
                transaction_type: transaction.type,
                project_id: transaction.data.projectId,
                create_txs_project_beneficiary_create_address: transaction.data.projectBeneficiaryCreateAddress,
                create_txs_project_create_timestamp: transaction.data.projectCreateTimestamp,
                transaction_signature: transaction.data.signature
            }
            
        }
        if(transaction.type==="confirm"){
        
             transactionDBObj ={
                transaction_type: transaction.type,
                project_id: transaction.data.projectId,
                confirm_txs_project_organization_confirm_address: transaction.data.projectOrganizationConfirmAddress,
                confirm_txs_project_confirm_timestamp: transaction.data.projectConfirmTimestamp,
                transaction_signature: transaction.data.signature
            }
            
        }
        if(transaction.type==="donate"){
            transactionDBObj ={
                transaction_type: transaction.type,
                project_id: transaction.data.projectId,
                donate_txs_from_address: transaction.data.fromAddress,
                donate_txs_to_address: transaction.data.toAddress,
                donate_txs_amount: transaction.data.amount,
                donate_txs_timestamp: transaction.data.donateTimestamp,
                transaction_signature: transaction.data.signature
            }
        
        }

        if(transaction.type==="sendback"){
            transactionDBObj ={
                transaction_type: transaction.type,
                project_id: transaction.data.projectId,
                sendback_txs_from_address: transaction.data.fromAddress,
                sendback_txs_to_address: transaction.data.toAddress,
                sendback_txs_amount: transaction.data.amount,
                sendback_txs_timestamp: transaction.data.sendbackTimestamp,
                transaction_signature: transaction.data.signature
            }
        
        }
        return await blockchainModel.addTransactionToPDTable(transactionDBObj);
    }
    async miningBlock(){
        if (this.pendingTransactions.length >= constants.TRANSACTIONS_IN_BLOCK && !this.miningStatus) {//1
            this.miningStatus = true;
            let spliceNumber =
              this.pendingTransactions.length >= constants.TRANSACTIONS_IN_BLOCK//4
                ? constants.TRANSACTIONS_IN_BLOCK
                : this.pendingTransactions.length;
                console.log(spliceNumber);
            this.transactionBuffer = this.pendingTransactions.splice(0, spliceNumber);//1 //pendingtxs :5 => 1
            const delTransaction = this.transactionBuffer;
            //detele database
            delTransaction.map(async (txs)=>{
                await blockchainModel.deletePendingTransactionBySignature(txs.data.signature)
            });
            
            console.info("Starting mining block...");
            const previousBlock = this.getLatestBlock();
            //console.log(previousBlock);
            const transactionsInBlock = this.transactionBuffer.map((txData) => {
              let transaction = new Transaction(null,null);
              transaction.parseData(txData);
              return transaction;
            });
            const currentTimestamp = getFormattedDate();

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
    async mineBlock(block){
        this.blocksBuffer = block;
        this.confirm++;
        this.reset();//note 
        console.log("Mined Successfully");
        let tempChain = this.getBlocks();
        tempChain.push(block);
        console.log(tempChain);
         //save database //cai dat peer2peer can xoa di
         const blockObj = {
            block_index: block.index,
            block_timestamp: block.timestamp,
            block_hash: block.hash,
            block_previoushash: block.previousHash,
            block_nonce: block.nonce,
            block_difficulty: block.difficulty
        }
        //=================luu database project
        const addBlockResult = await blockchainModel.addNewBlock(blockObj);
        console.log("created Project:",addBlockResult);
        block.transactions.map(async(txs)=>{
             await this.addTransactionInBlockToDB(txs,block.index);
        });
        //=========================>xoa
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
    async confirmBlock() {
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
            const blockObj = {
                block_index: tempBlock.index,
                block_timestamp: tempBlock.timestamp,
                block_hash: tempBlock.hash,
                block_previoushash: tempBlock.previousHash,
                block_nonce: tempBlock.nonce,
                block_difficulty: tempBlock.difficulty
            }
            //=================luu database project
            const addBlockResult = await blockchainModel.addNewBlock(blockObj);
            console.log("created Project:",addBlockResult);
            tempBlock.transactions.map(async(txs)=>{
                 await this.addTransactionInBlockToDB(txs,tempBlock.index);
            });
            this.blocksBuffer = null;
            this.transactionBuffer = null;
            this.isConfirm = true;
            this.miningBlock();
          }
        }
    }
    async addTransactionInBlockToDB(transaction, block_index){
        console.log("test function", transaction);
        let transactionDBObj = null;
        if(transaction.type === "create"){
             transactionDBObj ={
                transaction_type: transaction.type,
                project_id: transaction.data.projectId,
                block_index: block_index,
                create_txs_project_beneficiary_create_address: transaction.data.projectBeneficiaryCreateAddress,
                create_txs_project_create_timestamp: transaction.data.projectCreateTimestamp,
                transaction_signature: transaction.data.signature
            }
            
        }
        if(transaction.type==="confirm"){
        
             transactionDBObj ={
                transaction_type: transaction.type,
                project_id: transaction.data.projectId,
                block_index: block_index,
                confirm_txs_project_organization_confirm_address: transaction.data.projectOrganizationConfirmAddress,
                confirm_txs_project_confirm_timestamp: transaction.data.projectConfirmTimestamp,
                transaction_signature: transaction.data.signature
            }
            
        }
        if(transaction.type==="donate"){
            transactionDBObj ={
                transaction_type: transaction.type,
                project_id: transaction.data.projectId,
                block_index: block_index,
                donate_txs_from_address: transaction.data.fromAddress,
                donate_txs_to_address: transaction.data.toAddress,
                donate_txs_amount: transaction.data.amount,
                donate_txs_timestamp: transaction.data.donateTimestamp,
                transaction_signature: transaction.data.signature
            }
        
        }

        if(transaction.type==="sendback"){
            transactionDBObj ={
                transaction_type: transaction.type,
                project_id: transaction.data.projectId,
                block_index: block_index,
                sendback_txs_from_address: transaction.data.fromAddress,
                sendback_txs_to_address: transaction.data.toAddress,
                sendback_txs_amount: transaction.data.amount,
                sendback_txs_timestamp: transaction.data.sendbackTimestamp,
                transaction_signature: transaction.data.signature
            }
        
        }
        return await blockchainModel.addTransactionInBlock(transactionDBObj);
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
