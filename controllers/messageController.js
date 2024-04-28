const response = require("../services/response.service");
const Message = require("../models/message");

exports.messageAdd = (req, res, next) => {
  response(res, async () => {
    const { senderId, recipientId, text } = req.body;
    let message = new Message();
    message._id = uuidv4();
    message.senderId = senderId;
    message.recipientId = recipientId;
    message.text = text;
    message.dateAdded = new Date();
    message.isRead = false;
    message.senderDeleted = false;
    message.recipientDeleted = false;

    await message.save();
    res.json({ message: "mesaj gönderildi!" });
    next();

  });
};
exports.removeByRecipientId = (req, res, next) => {
  response(res, async () => {
    const { _id } = req.body;
    let m = await Message.findById(_id);
    m.recipientDeleted = true;
    await Message.findByIdAndUpdate(_id, m);
    res.json({ message: "mesaj silindi!" });
    next();
  });
};
exports.getMessageCount = (req, res, next) => {
  response(res, async () => {
    const { recipientId } = req.body;
    const count = await Message.find({ recipientId: recipientId })
      .$where({ isRead: false })
      .count();
    res.json({ count: count });
    next();

  });
};
exports.getMessages = (req, res, next) => {
  response(res, async () => {

    const { mesajtipi } = req.body;
    if (mesajtipi == "gelenler") {
      const { recipientId } = req.body;
      const messages = await Message.aggregate([
        {
          $match: { recipientId: recipientId }
        },
        {
          $match: { recipientDeleted: false }
        },
        {
          $lookup: {
            from: "users",
            localField: "senderId",
            foreignField: "_id",
            as: "senders"
          }
        }
      ]);
      res.json(messages);
      next();

    } else {
      const { senderId } = req.body;
      const messages = await Message.aggregate([
        {
          $match: { senderId: senderId }
        },
        {
          $match: { senderDeleted: false }
        },
        {
          $lookup: {
            from: "users",
            localField: "recipientId",
            foreignField: "_id",
            as: "recipients"
          }
        }
      ]);
      res.json(messages);
      next();

    }

  });
};