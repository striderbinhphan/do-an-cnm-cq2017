const CharityBlockChain = require('./src/blockchain');
const Transaction = require("./src/transaction");
const Block = require('./src/block');
const Project = require('./src/project');
const Address = require("./src/address");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const charityBlockChain  = new CharityBlockChain();



const beneficiary1 = new Address("beneficiary1", "beneficiary");
const beneficiary2 = new Address("beneficiary2", "beneficiary");
const organization1 = new Address("organization1", "organization");
const organization2 = new Address("organization2", "organization");
const donator1 = new Address("donator1", "donator");
const donator2 = new Address("organization2", "donator");

console.log(donator1.getAddress());
console.log(donator1.getPrivateKey());

//beneficiaryPrivateKey
//678ccf460c9a81318d249ae688268f94db5cd8c588ac644e00f1fc7d5454e83c
// organizationPrivateKey
// 2c5e2cb260f4bc5d8478efbd2deb350ec7b653be67136492c454a04f04d881c0
//donattorPrivateKey
//61aeb7ba9d68492e453349583bd6f38db5aa8e72932517a916a89b8b308af700
const beKey = ec.keyFromPrivate("678ccf460c9a81318d249ae688268f94db5cd8c588ac644e00f1fc7d5454e83c",'hex');
const beAddress = beKey.getPublic('hex');
const orKey = ec.keyFromPrivate("2c5e2cb260f4bc5d8478efbd2deb350ec7b653be67136492c454a04f04d881c0",'hex');
const orAddress = orKey.getPublic('hex');
const doKey = ec.keyFromPrivate("61aeb7ba9d68492e453349583bd6f38db5aa8e72932517a916a89b8b308af700",'hex');
const doAddress = doKey.getPublic('hex');
const nguoiTantatProject = {
    "projectName":"Ung ho nguoi tan tat",
    "projectBeneficiaryCreateAddress": "04b05eabf7b2fb789f4c183ff0bf6f2d1b97b2e0cdae742a81776689feae599e4fb8ec8d2f3ed94b2aef58cf282bf9dd8873b9099a45d2a68ed4256c02e337295f",
    "projectDescription": "ung ho nguoi tan tat kho khan, vo gia cu",
    "projectDeadline":12344,
    "projectTimestamp":12300
    
}

charityBlockChain.createProject(nguoiTantatProject);
charityBlockChain.createProject(nguoiTantatProject);



charityBlockChain.createUser(beneficiary1);
charityBlockChain.createUser(beneficiary2);
charityBlockChain.createUser(organization1);
charityBlockChain.createUser(organization2);
charityBlockChain.createUser(donator1);
charityBlockChain.createUser(donator2);


const CreatedData = {
    projectId :1,
    beneficiaryAddress : beAddress,
    timestamp : 12347,
}
const createdTxs = new Transaction("create",CreatedData);
createdTxs.signTransaction(beKey);
//console.log(createdTxs);
charityBlockChain.addTransaction(createdTxs); 


const confirmData ={
    projectId :1,
    organizeAddress: orAddress,
    beneficiaryAddress : beAddress,
    timestamp : 12347,
};


const confirmTxs = new Transaction("confirm",confirmData);
confirmTxs.signTransaction(orKey);
charityBlockChain.addTransaction(confirmTxs); 


const donateData ={
    projectId :1,
    fromAddress: doAddress,
    toAddress : orAddress,
    amount: 100,
    timestamp : 12400,
};


const donateTxs = new Transaction("donate",donateData);
donateTxs.signTransaction(doKey);
charityBlockChain.addTransaction(donateTxs); 


const organizeToBeneficiaryData ={
    projectId :1,
    fromAddress: orAddress,
    toAddress : beAddress,
    amount: 100,
    timestamp : 12400,
};


const finalTxs = new Transaction("donate",organizeToBeneficiaryData);
finalTxs.signTransaction(orKey);
charityBlockChain.addTransaction(finalTxs); 




console.log(charityBlockChain.getLatestBlock());
