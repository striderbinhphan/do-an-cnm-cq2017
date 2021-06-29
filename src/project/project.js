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
    constructor (projectId, projectName, projectBeneficiaryCreateAddress,projectOrganizationConfirmAddress, projectDescription, projectCreateTimestamp,projectConfirmTimestamp , projectDeadline){
        this.projectId = projectId;
        this.projectName = projectName;
        this.projectBeneficiaryCreateAddress = projectBeneficiaryCreateAddress;
        this.projectOrganizationConfirmAddress = projectOrganizationConfirmAddress||null;
        this.projectDescription = projectDescription;
        this.projectCreateTimestamp =projectCreateTimestamp;
        this.projectConfirmTimestamp = projectConfirmTimestamp||null;
        this.projectDeadline = projectDeadline;
    }
    //other methods
    setDeadline(newDeadline){
        this.projectDeadline = newDeadline;
    }
    setOrganizationConfirmedAddress(projectOrganizationConfirmAddress){
        this.projectOrganizationConfirmAddress = projectOrganizationConfirmAddress;
    }
    getProjectId(){
        return this.projectId;
    }
    setInfo(projectData){
        this.projectId = projectData.projectId;
        this.projectName = projectData.projectName;
        this.projectBeneficiaryCreateAddress = projectData.projectBeneficiaryCreateAddress;
        this.projectDescription = projectData.projectDescription;
        this.projectDeadline = projectData.projectDeadline;
        this.projectCreateTimestamp = projectData.projectCreateTimestamp;
    }
}   
module.exports = Project;