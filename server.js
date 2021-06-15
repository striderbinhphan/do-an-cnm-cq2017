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
const {transactions} = require('./utils/constants');

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(logger('dev'));

const charityBlockChain = new BlockChain(io,null);
var nodeList = [];
var status = false;

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
   

httpServer.listen(PORT, () =>
  console.info(`Express server running on http://localhost:${PORT}...`)
);
