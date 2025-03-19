const mongoose = require("mongoose");

// Define the Notification Schema
const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", // Reference to the User who will receive the notification
    required: true
  },
  type: {
    type: String, 
    enum: ["Project Update", "Approval Required", "Feedback", "Reminder", "General"],
    required: true
  },
  message: { 
    type: String, 
    required: true 
  },
  status: {
    type: String, 
    enum: ["unread", "read"],
    default: "unread"
  },
  timestamp: { 
    type: Date, 
    default: Date.now
  },
  // Optionally, we can track additional metadata
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Project", 
    required: false // Can be null if not related to a project
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", // Optional field to track who sent the notification (e.g., admin, advisor)
    required: false
  },
});

// Create the Notification model
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
