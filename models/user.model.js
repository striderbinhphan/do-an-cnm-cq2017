const db = require('../utils/db');
module.exports = {
    all(){
        return db('users');
    },
    addNewUser(newUser){
        return db('users').insert(newUser);
    },
    async isExistUser(address){
        const result =  await db('users').where("address",address);
        if(result.length === 0){
            return false;
        }else{
            return true;
        }
    },
    getSingleUser(address){
        return db('users').where("address",address);
    }
}
