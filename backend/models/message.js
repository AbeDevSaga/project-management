// message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messageContent: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
  messageType: {
    type: String,
    enum: ["text", "file"],
    default: "text",
  },
  fileUrl: {
    type: String,
  },
});

module.exports = messageSchema; // Export message schema for use
