// message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
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
  type: {
    type: String,
    enum: ["text", "file"],
    default: "text",
  },
  file: {
    type: String,
  },
});

module.exports = mongoose.model("Message", messageSchema);
