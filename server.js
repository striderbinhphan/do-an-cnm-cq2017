const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer);
const client = require("socket.io-client");
const socketListeners = require("./socketListeners");
const logger = require("morgan");
const axios = require("axios");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const BlockChain = require("./models/blockchain");
const Address = require("./models/address/address");
const { transactions } = require("./utils/constants");
//const projectModel = require('./models/project/project.model');
//const transactionModel = require('./models/transaction/transaction.model');
const blockchainModel = require("./models/blockchain.model");
const { getFormattedDate } = require("./utils/common-function");
const config = require('./config')
const PORT = config.port
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cors());

const charityBlockChain = new BlockChain(io, null);
var nodeList = [];
var status = false;
app.post("/register", (req, res) => {
  const { name, email } = req.body;
  const role = "user";
  //console.log( email);
  const newUser = new Address(name, email, role);
  const userToSave = {
    address: newUser.address,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
  console.log(userToSave);
  charityBlockChain.createUser(userToSave);
  res
    .json({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      address: newUser.address,
      privateKey: newUser.privateKey,
    })
    .end();
});
app.post("/login", (req, res) => {
  const { publicKey, privateKey } = req.body;
  if (charityBlockChain.isUserExisting(publicKey)) {
    if (ec.keyFromPrivate(privateKey, "hex").getPublic("hex") === publicKey) {
      const payload = charityBlockChain.getUserInfo(publicKey);
      res
        .json({
          name: payload.name,
          email: payload.email,
          role: payload.role,
          address: payload.address,
        })
        .end();
    } else {
      res.json({ status: "invalid private/public key" }).end();
    }
  } else {
    res.json({ status: "This address isn't exist! please register" }).end();
  }
});
app.get("/users", (req, res) => {
  return res.json(charityBlockChain.getUserList()).end();
});
app.get("/pending-transactions", (req, res) => {
  return res.json(charityBlockChain.getPendingTransactions()).end();
});
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
app.get("/blocks", (req, res) => {
  res.json(charityBlockChain.getBlocks()).end();
});
app.get("/projects", (req, res) => {
  res.json(charityBlockChain.getProjectList()).end();
});
app.post("/projects", async (req, res) => {
  const {
    projectName,
    projectBeneficiaryCreateAddress,
    projectDescription,
    projectDeadline,
    privateKey,
  } = req.body;
  const project = {
    projectName,
    projectBeneficiaryCreateAddress,
    projectDescription,
    projectDeadline,
    projectCreateTimestamp: getFormattedDate(),
  };
  console.log(project);
  const createrEcKey = ec.keyFromPrivate(privateKey, "hex");

  if (await charityBlockChain.createProject(project, createrEcKey)) {
    console.log("create success");
    return res.status(201).end();
  } else {
    console.log("create failed");
    return res.status(204).end();
  }
});
app.get("/unconfirm-projects", (req, res) => {
  res.json(charityBlockChain.getUnconfirmProjectList()).end();
});
app.get("/confirm-projects", (req, res) => {
  res.json(charityBlockChain.getConfirmProjectList()).end();
});
app.post("/unconfirm-projects", async (req, res) => {
  const { projectId, projectOrganizationConfirmAddress, privateKey } = req.body;
  const confirmData = {
    projectId,
    projectOrganizationConfirmAddress,
    projectConfirmTimestamp: getFormattedDate(), //ms
  };
  console.log(confirmData);
  const confirmEcKey = ec.keyFromPrivate(privateKey, "hex");
  if (await charityBlockChain.confirmProject(confirmData, confirmEcKey)) {
    console.log("success");
    res.status(201).end();
  } else {
    console.log("fail");
    res.status(204).end();
  }
});
app.get("/donate-projects", (req, res) => {
  res.json(charityBlockChain.getDonateProjectList()).end();
});
app.post("/donate-projects", async (req, res) => {
  const { projectId, fromAddress, amount, privateKey } = req.body;
  console.log(projectId);
  const toOrganizationAddress =
    charityBlockChain.getOrganizationConfirmAddressFromProjectId(projectId);
  const donateData = {
    projectId,
    fromAddress,
    toAddress: toOrganizationAddress,
    amount,
    donateTimestamp: getFormattedDate(), //ms,
  };
  const confirmEcKey = ec.keyFromPrivate(privateKey, "hex");
  if (await charityBlockChain.donateProject(donateData, confirmEcKey)) {
    console.log("success");

    res.status(201).end();
  } else {
    console.log("fail");
    res.status(204).end();
  }
});

app.get("/user/:address", async (req, res) => {
  const address = req.params.address;
  const list = await blockchainModel.getUserByAddress(address);
  if (list.length === 0) {
    return res.status(204).end();
  }
  res.json(list[0]);
});

app.get("/project/:id/transactions", async (req, res) => {
  const id = +req.params.id;
  const list = await blockchainModel.getTransactionByProjectID(id);
  if (list.length === 0) {
    return res.status(204).end();
  }
  res.json(list);
});

app.get("/project/:id/donateTransactions", async (req, res) => {
  const id = +req.params.id;
  const list = await blockchainModel.getDonateTransactionByProjectID(id);
  if (list.length === 0) {
    return res.status(204).end();
  }
  res.json(list);
});
app.get("/project/:id/sendbackTransactions", async (req, res) => {
  const id = +req.params.id;
  const list = await blockchainModel.getSendbackTransactionByProjectID(id);
  if (list.length === 0) {
    return res.status(204).end();
  }
  res.json(list);
});

app.get("/project/:id", async (req, res) => {
  const id = +req.params.id;
  const list = await blockchainModel.getProjectByID(id);
  if (list.length === 0) {
    return res.status(204).end();
  }
  res.json(list[0]);
});
app.get("/confirmedProject/:organizationAddress", async (req, res) => {
  const organizationAddress = req.params.organizationAddress;
  const list = await blockchainModel.getAllProjectConfirmedByOrganizationAddress(organizationAddress);
  if (list.length === 0) {
    return res.status(204).end();
  }
  res.json(list);
});
app.get("/createdProject/:beneficiaryAddress", async (req, res) => {
  const beneficiaryAddress = req.params.beneficiaryAddress;
  const list = await blockchainModel.getAllProjectCreatedByBeneficiaryAddress(beneficiaryAddress);
  if (list.length === 0) {
    return res.status(204).end();
  }
  res.json(list);
});


app.get("/transaction/:id", async (req, res) => {
  const id = +req.params.id;
  const list = await getTransactionByID(id);
  if (list.length === 0) {
    return res.status(204).end();
  }
  res.json(list);
});

app.get("/project/:id/totaldonate", async (req, res) => {
  const id = +req.params.id;
  const ret = await blockchainModel.getTotalDonateByProjectID(id);
  if (ret[0].totaldonate === null) {
    result = {
      totaldonate: 0,
    };
    res.json(result);
  }

  result = {
    totaldonate: +ret[0].totaldonate,
  };
  res.json(result);
});

app.get("/project/:id/totalSendBack", async (req, res) => {
  const id = +req.params.id;
  const ret = await blockchainModel.getTotalSendBackByProjectID(id);
  if (ret[0].totalsendback === null) {
    result = {
      totalsendback: 0,
    };
    res.json(result);
  }

  result = {
    totalsendback: +ret[0].totalsendback,
  };
  res.json(result);
});

app.post("/sendback-projects", async (req, res) => {
  const { projectId, amount, privateKey } = req.body;
  const toBeneficiaryAddress =
    charityBlockChain.getBeneficiaryAddressFromProjectId(projectId);
  const fromAddress =
    charityBlockChain.getOrganizationConfirmAddressFromProjectId(projectId);
  const sendbackInfo = {
    projectId,
    fromAddress,
    toAddress: toBeneficiaryAddress,
    amount,
    donateTimestamp: new Date().getTime(), //ms,
  };
  const confirmEcKey = ec.keyFromPrivate(privateKey, "hex");
  if (await charityBlockChain.sendbackProject(sendbackInfo, confirmEcKey)) {
    console.log("success");

    res.status(201).end();
  } else {
    console.log("fail");
    res.status(204).end();
  }
});
app.get("/donate-transactions", async (req, res) => {
  const list = await blockchainModel.getDonateTransactions();
  if (list.length === 0) {
    return res.status(204).end();
  }
  res.json(list);
});

app.get("/fetch", async (req, res) => {
  const list = await charityBlockChain.fetchData();
  res.json(list).end();
});

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
