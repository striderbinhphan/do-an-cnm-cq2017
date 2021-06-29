const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
//Description UserAddress in our blockchain
class Address{
    constructor(){
    }
    generateKeyPair(){
        const key = ec.genKeyPair();
        const publicKey = key.getPublic('hex');
        const privateKey = key.getPrivate('hex');
        return {
            publicKey,
            privateKey
        };
    }
    //publicKey == address
    isValidPrivateKey(inputPrivateKey){
        const key = ec.keyFromPrivate(inputPrivateKey);
        const address = key.getPublic('hex');
        if(this.isValidAddress(address)){
            return true;
        }
        console.log("This wallet isn't created");
        return false;
    }
}
module.exports = Address;