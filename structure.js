//project structure
// Project {
//     projectId: 0,
//     projectName: 'Ung ho nguoi tan tat',
//     projectBeneficiaryCreateAddress: '04b05eabf7b2fb789f4c183ff0bf6f2d1b97b2e0cdae742a81776689feae599e4fb8ec8d2f3ed94b2aef58cf282bf9dd8873b9099a45d2a68ed4256c02e337295f',
//     projectOrganizationConfirmAddress: '042f021e4b6a4d5829a762721ea7aaeeccfb219f0c4af987a6a4d5b830d7a9ac95d0a3f7760703fa75d9dfb4366d5fc7fb42c87d5eaa648552b765ad6deed0dcbf',
//     projectDescription: 'ung ho nguoi tan tat kho khan, vo gia cu',
//     projectCreateTimestamp: 12300,
//     projectConfirmTimestamp: 12347,
//     projectDeadline: 12344
//   }
// //create transaction
//   parseData(data) {
//     this.projectId = data.projectId;
//     this.projectBeneficiaryCreateAddress = data.projectBeneficiaryCreateAddress;
//     this.projectCreateTimestamp = data.projectCreateTimestamp;
// }
// //confirm transaction
// parseData(confirm) {
//     this.projectId = data.projectId;
//     this.projectOrganizationConfirmAddress = data.projectOrganizationConfirmAddress;
//     this.projectConfirmTimestamp = data.projectConfirmTimestamp;
// }

// //donate transaction
// parseData(data) {
//     this.projectId  = data.projectId; 
//     this.fromAddress = data.fromAddress;
//     this.toAddress = data.toAddress;
//     this.amount  = data.amount;
//     this.donateTimestamp = data.donateTimestamp;
// }
// //sendback transaction
// parseData(data) {
//     this.projectId  = data.projectId; 
//     this.fromAddress = data.fromAddress;
//     this.toAddress = data.toAddress;
//     this.amount  = data.amount;
//     this.sendbackTimestamp = data.sendbackTimestamp;
// }