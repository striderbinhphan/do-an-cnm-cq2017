const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
class Address{
    generateKeyPair(name, role){
        const key = ec.genKeyPair();
        const publicKey = key.getPublic('hex');
        const privateKey = key.getPrivate('hex');
        this.address = publicKey;
        this.name = name;
        this.role = role;
        return JSON.stringify({
            publicKey: publicKey,
            privateKey: privateKey
        })
    }
    getAddress(){
        return this.address;
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
    // isValidAddress(address){
    //     return this.walletArray.includes(address);
    // }
    // addAddress(address){
    //     if(!this.isValidAddress(address)){
    //         this.walletArray.push(address)
    //     }else{
    //         console.log("This wallet is existing");
    //     }
    // }
}
module.exports = Address;