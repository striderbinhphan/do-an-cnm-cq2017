const CharityBlockChain = require('./models/blockchain');
const Transaction = require("./models/transaction/transaction");
const Block = require('./models/block');
const Project = require('./models/project/project');
const Address = require("./models/address/address");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const app = require("express")();
const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer);


const orga1 = new Address("Hoi chu thap do", "hctd@gmail.com", "organization");
const orga2 = new Address("Mac tran To quoc Viet Nam", "mttqvn@gmail.com", "organization");

console.log(orga1);
console.log(orga2);
const or1 = {
    name: 'Hoi chu thap do',
    email: 'hctd@gmail.com',
    role: 'organization',
    address: '04f8d1e28efd7f3ddc40686cccc0b025597e192bf6aac9ada6bfda95848296a68da6a4e30f98aa340a90b05c30fca885acc1abfbd043116c4ed77f8903eb6ba489',
    privateKey: '3fbb3fed684ae4e72f7248bb2d6d0c344f60e5682512e7232ec9f2faceeb3434'
};
const or2 =  {
    name: 'Mac tran To quoc Viet Nam',
    email: 'mttqvn@gmail.com',
    role: 'organization',
    address: '043357fbded6ac0519e19db7cead0d6579876ff4c274a776d50cfde9cfb60642bbacb1a323cf952f36f85fe24f0f220a067e9e52d3e61f37701e7e1f4a399722bf',
    privateKey: 'aa97347d0e6d894fb7e74df806e86d5f48ada05e180fa1cf6b3791b14718b1c5'
}