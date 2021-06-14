const CharityBlockChain = require('./src/blockchain');
const Block = require('./src/block');
const Project = require('./src/project');
const charityProject  = new CharityBlockChain();
console.log(charityProject.getLatestBlock());
const nguoiTantatProject = {
    "projectName":"Ung ho nguoi tan tat",
    "projectBeneficiaryCreateAddress": "test",
    "projectDescription": "ung ho nguoi tan tat kho khan, vo gia cu"
}
charityProject.addProject(nguoiTantatProject);

const nguoiTantat2Project = {
    "projectName":"Ung ho nguoi tan tat",
    "projectBeneficiaryCreateAddress": "test",
    "projectDescription": "ung ho nguoi tan tat kho khan, vo gia cu"
}
charityProject.addProject(nguoiTantat2Project);
console.log(charityProject.projectList);

const beneficiary1 = charityProject.createUser("beneficiary1", "beneficiary");
const beneficiary2 = charityProject.createUser("beneficiary2", "beneficiary");
const organization1 = charityProject.createUser("organization1", "organization");
const organization2 = charityProject.createUser("organization2", "organization");
const donator1 = charityProject.createUser("donator1", "donator");
const donator2 = charityProject.createUser("donator2", "donator");
console.log(charityProject.addressList);

charityProject.addTransaction("create",{
        projectId:1,
        beneficiaryAddress:charityProject.getAddress("beneficiary1"),
        timestamp:12345
    }
);


