const express = require("express");
const router = express.Router();
const Client = require("../models/client");
const Approval = require("../models/approval");
const User = require("../models/user");
const { authenticateToken, giveUniqueId, responseFormatter, isAuth } = require("../config/util");

/**
 * This route will give the information of all the clients.
 */
router.get("/", authenticateToken, isAuth, async (req, res) => {
  try {
    if (req.query.type) {
      const clientData = await Client.find({ gst: { $exists: true } }, ['_id', 'dependent', 'businessName', 'uniqueId', 'contacts.primaryMobile', 'gst']);
      responseFormatter(res, null, { data: clientData });
    } else {
      const clientsData = await Client.find({}, ['_id', 'dependent', 'businessName', 'uniqueId', 'contacts.primaryMobile', 'gst']);
      responseFormatter(res, null, { data: clientsData });
    }
  } catch (e) {
    responseFormatter(res, { message: e.message }, null);
  }
});

/**
 * This route will give the information of a particular client.
 */
router.get("/:clientId", authenticateToken, isAuth, async (req, res) => {
  try {
    const clientData = await Client.findOne({ _id: req.params.clientId });
    responseFormatter(res, null, { data: clientData });
  } catch (e) {
    responseFormatter(res, { message: e.message }, null);
  }
})

/**
 * This route will create a new client.
 */
router.post("/", authenticateToken, isAuth, async (req, res) => {
  try {
    const clientData = await Client.findOne({ businessName: req.body.businessName });
    if (clientData) {
      responseFormatter(res, { message: "Business name already exists!" }, null);
    } else {
      const clientData = await Client.find({});
      const uniqueId = giveUniqueId(clientData);
      const createClient = new Client(req.body);
      createClient.uniqueId = uniqueId;
      const newClient = await createClient.save();
      responseFormatter(res, null, { data: { clientId: createClient._id } });
    }
  } catch (e) {
    responseFormatter(res, { message: e.message }, null);
  }
})

/**
 * This route will update the client's details.
 */
router.put("/:clientId", authenticateToken, isAuth, async (req, res) => {
  try {
    const clientData = await Client.findOne({ businessName: req.body.businessName });
    if (clientData && clientData._id != req.params.clientId) {
      responseFormatter(res, { message: "Business name already exists!" }, null);
    } else {

      if (req.user.role === 'Admin') {
        const updateClient = await Client.findOneAndUpdate(
          { _id: req.params.clientId },
          req.body, { new: true }
        )
        responseFormatter(res, null, { message: "Client updated successfully." });
      } else {
        const userData = await User.findOne({ _id: req.user._id }, ['_id', 'name', 'uniqueId']);
        const newApprovalRequest = new Approval({
          approvalRequest: "updateClient",
          requestingUser: userData,
          requestingForClient: req.params.clientId,
          data: req.body,
          status: "open"
        });
        const createApprovalRequest = await newApprovalRequest.save();
        responseFormatter(res, null, { message: "Client get updated once Admin will approve." });
      }
    }
  } catch (e) {
    console.log(e);
    responseFormatter(res, { message: e.message }, null);
  }
})

/**
 * This route will delete a client.
 */
router.delete("/:clientId", authenticateToken, isAuth, async (req, res) => {
  try {
    const clientData = await Client.findOne({ _id: req.params.clientId });
    if (req.user.role === 'Admin') {
      const deleteClient = await Client.deleteMany({ _id: req.params.clientId });
      responseFormatter(res, null, { message: "Client removed successfully." });
    } else {
      const userData = await User.findOne({ _id: req.user._id }, ['_id', 'name', 'uniqueId']);
      const newApprovalRequest = new Approval({
        approvalRequest: "deleteClient",
        requestingUser: userData,
        requestingForClient: req.params.clientId,
        data: clientData,
        status: "open"
      });
      const createApprovalRequest = await newApprovalRequest.save();
      responseFormatter(res, null, { message: "Client get removed once admin approves." });
    }
  } catch (e) {
    responseFormatter(res, { message: e.message }, null);
  }
})





module.exports = router
