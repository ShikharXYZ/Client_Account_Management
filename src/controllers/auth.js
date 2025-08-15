
const { secretToken } = require('../config/constant.js');
const { responseFormatter } = require('../config/util.js');
const express = require('express');
const router = express.Router();
const Client = require('../models/client.js');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');


router.post("/login", async (req, res) => {
  try {
    const findUser = await User.findOne({ username: req.body.username });
    if (findUser) {
      if (findUser.password === req.body.password) {

        const user = {
          _id: findUser._id,
          name: findUser.name,
          username: findUser.username,
          role: findUser.role
        };
        const accessToken = jwt.sign(user, secretToken);
        const data = {
          accessToken: accessToken,
          _id: findUser._id,
          name: findUser.name,
          role: findUser.role,
          username: findUser.username
        };
        responseFormatter(res, null, { data });

      } else {
        responseFormatter(res, { message: "Incorrect Password!" }, null);
      }
    } else {
      responseFormatter(res, { message: "You are not registered!" }, null);
    }
  } catch (e) {
    responseFormatter(res, { message: e.message }, null);
  }
})

module.exports = router;
