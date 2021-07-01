const db = require('../utils/db');
module.exports = {
    all(){
        return db('project');
    },
    addNewProject(newProject){
        return db('project').insert(newProject);
    },
    getConfirmProjectList(){
        return db('project').whereNot("project_organization_confirm_address", null);
    },
    async isExistProject(projectName){
        const result =  await db('project').where("project_name",projectName);
        if(result.length === 0){
            return false;
        }else{
            return true;
        }
    },
    getUnconfirmProjectList(){
        return db('project').where("project_organization_confirm_address", null);
    },
    async isExistProjectById(projectId){
        const result =  await db('project').where("project_id",projectId);
        if(result.length === 0){
            return false;
        }else{
            return true;
        }
    },
    async getProjectId(projectName){
        const project = await db('project').where('project_name',projectName);
        return project[0].project_id;
    },

    async isUnconfirmed(projectId){
        const result =  await db('project').where("project_id",projectId).where("project_organization_confirm_address",null);
        if(result.length === 0){
            return false;
        }else{
            return true;
        }
    },
    updateConfirmAddress(projectId, address, timestamp){
        return db('project').where({
          project_id: projectId
        }).update({
          project_organization_confirm_address: address,
          project_confirm_timestamp: timestamp
        })
    },
    async getOrganizationConfirmAddress(projectId){
        const project = await db('project').where('project_id',projectId);
        return project[0].project_organization_confirm_address;
    },
    async getDeadline(projectId){
        const project = await db('project').where('project_id',projectId);
        return project[0].project_deadline;
    },
    async getBeneficiaryAddress(projectId){
        const project = await db('project').where('project_id',projectId);
        return project[0].project_beneficiary_create_address;
    }

    
    
    
   
    
}
