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
},
{ timestamps: true });
//68239989d8a00f41485b9a03
//6823a7bd69f8c2d6486e242c

module.exports = mongoose.model("Message", messageSchema);
