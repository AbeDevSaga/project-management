const mongoose = require('mongoose');
const messageSchema = require("./message");

// Schema to store the entire chat between a student and their advisor
const chatSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },  // Student involved in the chat
  advisor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },  // Advisor involved in the chat
  messages: [messageSchema],  // Array of messages exchanged
  createdAt: { 
    type: Date, 
    default: Date.now 
  },  // When the chat was created
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }  // When the chat was last updated
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
