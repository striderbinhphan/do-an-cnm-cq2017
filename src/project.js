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
    constructor (projectId, projectName, projectBeneficiaryCreateAddress, projectDescription, projectDeadline, projectTimestamp){
        this.projectId = projectId;
        this.projectName = projectName;
        this.projectBeneficiaryCreateAddress = projectBeneficiaryCreateAddress;
        this.projectDescription = projectDescription;
        this.projectDeadline = projectDeadline;
        this.projectTimestamp =projectTimestamp;
    }
    //other methods
    setDeadline(newDeadline){
        this.projectDeadline = newDeadline;
    }
    setStatus(status){
        this.projectStatus = status;//created, confirmed, closed
    }
    setOrganizationConfirmedAddress(organizeAddress){
        this.projectOrganizationAddress = organizeAddress;
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
        this.projectTimestamp = projectData.projectTimestamp;
    }
}   
module.exports = Project;