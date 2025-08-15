//jshint esversion:6
const { mongoURL } = require("../../Documents/CA360-Server/src/config/constant.js");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads/', express.static("public/uploads"));

mongoose.connect(mongoURL, {
  useNewUrlParser: true
});

const Client = require('../../Documents/CA360-Server/src/models/client.js');
const User = require('../../Documents/CA360-Server/src/models/user.js');
const Task = require('../../Documents/CA360-Server/src/models/task.js');
const Role = require('../../Documents/CA360-Server/src/models/role.js');
const Approval = require('../../Documents/CA360-Server/src/models/approval.js');

const userRoute = require("../../Documents/CA360-Server/src/controllers/user.js");
const clientRoute = require("../../Documents/CA360-Server/src/controllers/client.js");
const loginRoute = require("../../Documents/CA360-Server/src/controllers/auth.js");
const taskRoute = require("../../Documents/CA360-Server/src/controllers/task.js");
const enumRoute = require("../../Documents/CA360-Server/src/controllers/enums.js");
const roleRoute = require("../../Documents/CA360-Server/src/controllers/role.js");
const uploadFilesRoute = require("../../Documents/CA360-Server/src/controllers/uploadFiles.js");
const approvalRoute = require("../../Documents/CA360-Server/src/controllers/approval.js");

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
};
const cors = require("cors");
app.use(cors(corsOptions));

app.use("/api/user", userRoute);
app.use("/api/client", clientRoute);
app.use("/api/auth", loginRoute);
app.use("/api/task", taskRoute);
app.use("/api/enums", enumRoute);
app.use("/api/role", roleRoute);
app.use("/api/task", uploadFilesRoute);
app.use("/api/approval", approvalRoute);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
