const mongoose = require("mongoose");

// Schema to store individual messages in the chat
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Sender of the message (either Student or Advisor)
  messageContent: {
    type: String,
    required: true,
  }, // Content of the message
  timestamp: {
    type: Date,
    default: Date.now,
  }, // When the message was sent
  read: {
    type: Boolean,
    default: false,
  }, // Whether the message has been read
  messageType: {
    type: String,
    enum: ["text", "file"],
    default: "text",
  }, // Message type (text or file)
  fileUrl: {
    type: String,
  }, // URL of the file if the message is a file
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
