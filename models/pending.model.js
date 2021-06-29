const db = require('../utils/db');
module.exports = {
    all(){
        return db('pending_transactions');
    },
    async getLength(){
        const list = await db('pending_transactions');
        return list.length;
    },
    addNewPending(newPendingTxs){
        return db('pending_transactions').insert(newPendingTxs);
    },
    deleteMinePendingTransaction(signature){//xoa danh sach cac pending transaction dem di mine
        return db('pending_transactions').where('transaction_signature',signature).del();
    }
}
