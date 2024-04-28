const express = require("express");
const router = express.Router();
const response = require("../services/response.service");
const Message = require("../models/message");
const messageController = require("../controllers/messageController");
const { v4: uuidv4 } = require("uuid");

router.route("/add").
    post(messageController.messageAdd);
router.route("/removeByRecipientId").
    post(messageController.removeByRecipientId);
router.route("/getCount").
    post(messageController.getMessageCount);

router.route("/").
    post(messageController.getMessages);
module.exports = router;