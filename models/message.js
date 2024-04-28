const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    _id: String,
    senderId: String,
    recipientId: String,
    text:String,
    dateAdded:Date,
    dateRead:Date,
    isRead:Boolean,
    senderDeleted:Boolean,
    recipientDeleted:Boolean
});

const Message = mongoose.model("Message",messageSchema);
module.exports = Message;
