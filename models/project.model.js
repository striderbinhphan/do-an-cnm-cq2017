const db = require('../utils/db');
module.exports = {
    all(){
        return db('project');
    },
    // addNewUser(newUser){
    //     return db('project').insert(newUser);
    // },
    // async isExistUser(address){
    //     const result =  await db('project').where("address",address);
    //     if(result.length === 0){
    //         return false;
    //     }else{
    //         return true;
    //     }
    // },
    // getSingleUser(address){
    //     return db('project').where("address",address);
    // }
    async isExistProject(projectName){
        const result =  await db('project').where("project_name",projectName);
        if(result.length === 0){
            return false;
        }else{
            return true;
        }
    },
    async isUnconfirmed(projectName){
        const result =  await db('project').where("project_name",projectName).where("project_organization_confirm_address",null);
        if(result.length === 0){
            return false;
        }else{
            return true;
        }
    },
    addNewProject(newProject){
        return db('project').insert(newProject);
    },
    getConfirmProjectList(){
        return db('project').where("project_organization_confirm_address", null);
    },
    updateConfirmAddress(projectName, address, timestamp){
        return db('project').where({
          project_name: projectName
        }).update({
          project_organization_confirm_address: address,
          project_confirm_timestamp: timestamp
        })
    },
    async getDeadline(projectName){
        const project = await db('project').where('project_name',projectName);
        return project[0].project_deadline;
    },
    async getName(projectName){
        const project = await db('project').where('project_name',projectName);
        return project[0].project_name;
    },
    async getOrganizationConfirmAddress(projectName){
        const project = await db('project').where('project_name',projectName);
        return project[0].project_organization_confirm_address;
    },
    async getBeneficiaryAddress(projectName){
        const project = await db('project').where('project_name',projectName);
        return project[0].project_beneficiary_create_address;
    }
}
