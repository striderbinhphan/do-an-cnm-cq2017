class Project{
    // constructor(projectId, projectName, projectBeneficiaryCreateAddress, projectOrganizeConfirmAddress, projectDeadline, projectConfirmedTimestamp, projectStatus){
    //     this.projectId = projectId;
    //     this.projectName =projectName;
    //     this.projectBeneficiaryCreateAddress = projectBeneficiaryCreateAddress;
    //     this.projectOrganizeConfirmAddress = projectOrganizeConfirmAddress;
    //     this.projectConfirmedTimestamp = projectConfirmedTimestamp;
    //     this.projectDeadline  = projectDeadline;
    //     this.projectStatus = projectStatus;//created(được tạo chưa duyệt), accepted(được tổ chức duyệt), operating(đang diễn ra donate), closing(đã đóng chưua gửi tiền),done("hoàn tất")
    // }
    constructor (projectId, projectName, projectBeneficiaryCreateAddress, projectDescription){
        this.projectId = projectId;
        this.projectName = projectName;
        this.projectBeneficiaryCreateAddress = projectBeneficiaryCreateAddress;
        this.projectDescription = projectDescription;
    }
    //other methods
}
module.exports = Project;