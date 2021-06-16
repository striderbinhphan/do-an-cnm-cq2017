const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const httpServer = require('http').Server(app);
const io = require("socket.io")(httpServer);
const client = require("socket.io-client");
const socketListeners = require("./socketListeners");
const logger = require("morgan");
const axios = require("axios");
const EC =require('elliptic').ec;
const ec = new EC('secp256k1');
const BlockChain =require('./models/blockchain');
const Address = require('./models/address/address')
const {transactions} = require('./utils/constants');

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(logger('dev'));

const charityBlockChain = new BlockChain(io,null);
var nodeList = [];
var status = false;
app.post('/register',(req,res)=>{
  const {name, role} = req.body;
  const newUser = new Address(name,role);
  charityBlockChain.createUser(newUser);
  res.json({
    status:"success",
    name:newUser.name,
    address: newUser.address,
    privateKey: newUser.privateKey
  }).end();
})
app.post('/login',(req,res)=>{
  const {publicKey, privateKey} = req.body;
  if(charityBlockChain.isUserExisting(publicKey)){
    if(ec.keyFromPrivate(privateKey,'hex').getPublic('hex')===publicKey){
        const payload = charityBlockChain.getUserInfo(publicKey);
      res.json({
        status:"success",
        name: payload.name,
        role: payload.role
    }).end();
    }else{
      res.json({status:"invalid private/public key"}).end();
    }
  }else{
    res.json({status:"This address isn't exist! please register"}).end();
  }
})
app.post("/nodes", (req, res) => {
    const { host } = req.body;
    const { callback, nodeLength } = req.query;
    const node = `https://${host}`;
    const socketNode = socketListeners(io, client(node), charityBlockChain);
    nodeList.push({ node, id: socketNode.id });
    charityBlockChain.addNode(socketNode);
    if (callback === "true") {
      if (parseInt(nodeLength) > 1 && nodeList.length === 1) {
        axios.post(`${node}/request-list`, {
          host: req.hostname,
        });
      } else if (nodeList.length > 1 && parseInt(nodeLength) === 1) {
        axios.post(`${node}/update-list`, {
          requestNodeList: nodeList,
        });
      }
      console.info(`Added node ${node} back`);
      res.json({ status: "Added node Back" }).end();
    } else {
      axios.post(`${node}/nodes?callback=true&nodeLength=${nodeList.length}`, {
        host: req.hostname,
      });
      console.info(`Added node ${node}`);
      res.json({ status: "Added node" }).end();
    }
});
  
app.post("/request-list", (req, res) => {
    const { host } = req.body;
    const node = `https://${host}`;
    axios.post(`${node}/update-list`, {
      requestNodeList: nodeList,
    });
    res.json({ status: "request accepted" }).end();
});
app.post("/update-list", (req, res) => {
    const { requestNodeList } = req.body;
    const currentNode = `https://${req.hostname}`;
    console.log(currentNode);
  
    for (let index = 0; index < requestNodeList.length; index++) {
      if (requestNodeList[index].node !== currentNode) {
        axios.post(`${requestNodeList[index].node}/request-join`, {
          host: req.hostname,
        });
      }
    }
    res.json({ status: "node list return" }).end();
});
  
app.post("/request-join", (req, res) => {
    const { host } = req.body;
    const { callback } = req.query;
    const node = `https://${host}`;
    const socketNode = socketListeners(io, client(node), charityBlockChain);
    nodeList.push({ node, id: socketNode.id });
    charityBlockChain.addNode(socketNode);
    if (callback === "true") {
      console.info(`Added node ${node} back`);
      res.json({ status: "Added node Back" }).end();
    } else {
      axios.post(`${node}/request-join?callback=true`, {
        host: req.hostname,
      });
      console.info(`Added node ${node}`);
      res.json({ status: "Added node" }).end();
    }
});
app.get('/blocks',(req,res)=>{
  res.json(charityBlockChain.getBlocks()).end();
})   
app.get('/projects',(req,res)=>{
  res.json(charityBlockChain.getProjectList()).end();
})
app.post('/projects',async (req,res)=>{
  const {projectName, projectBeneficiaryCreateAddress, projectDescription, projectDeadline, privateKey} = req.body;
  const project ={
    projectName,
    projectBeneficiaryCreateAddress,
    projectDescription,
    projectDeadline,
    projectCreateTimestamp: new Date().getTime()//ms
  }
  const createrEcKey = ec.keyFromPrivate(privateKey,'hex');
  
  if(await charityBlockChain.createProject(project,createrEcKey)){
    return res.json({status:"Created project"}).end();
  }else{
    return res.json({status:"failed"}).end();
  }
})
app.get('/unconfirm-projects',(req,res)=>{
  res.json(charityBlockChain.getUnconfirmProjectList()).end();
})
app.post('/unconfirm-projects',async (req,res)=>{
  const {projectId, projectOrganizationConfirmAddress, privateKey}  = req.body;
  const confirmData  = {
    projectId,
    projectOrganizationConfirmAddress,
    projectConfirmTimestamp: new Date().getTime()//ms
  }
  const confirmEcKey = ec.keyFromPrivate(privateKey,'hex');
  if(await charityBlockChain.confirmProject(confirmData,confirmEcKey)){
    res.json({status:"Confirm project success"}).end();
  }else{
    res.json({status:"Confirm project failed"}).end();
  }
})
app.get('/donate-projects',(req,res)=>{
  res.json(charityBlockChain.getDonateProjectList()).end();
})
app.post('/donate-projects',async (req,res)=>{
  const {projectId, fromAddress, amount, privateKey}  = req.body;
  console.log(projectId);
  const toOrganizationAddress = charityBlockChain.getOrganizationConfirmAddressFromProjectId(projectId);
  const donateData  = {
    projectId,
    fromAddress,
    toAddress: toOrganizationAddress,
    amount,
    donateTimestamp: new Date().getTime()//ms,
  }
  const confirmEcKey = ec.keyFromPrivate(privateKey,'hex');
  if(await charityBlockChain.donateProject(donateData,confirmEcKey)){
    res.json({status:"Donate project success"}).end();
  }else{
    res.json({status:"Donate project failed"}).end();
  }
})

io.on("connection", (socket) => {
  console.info(`Socket connected, ID: ${socket.id}`);

  if (status === false) {
    setInterval(function () {
      if (!charityBlockChain.miningStatus) {
        io.emit(transactions.CHECKING);
      }
    }, 300000);
  }

  socket.on("disconnect", () => {
    console.log(`Socket disconnected, ID: ${socket.id}`);
    for (let index = 0; index < nodeList.length; index++) {
      if (nodeList[index].id === socket.id) {
        nodeList.splice(index, 1);
        break;
      }
    }
  });
});
httpServer.listen(PORT, () =>
  console.info(`Express server running on http://localhost:${PORT}...`)
);
