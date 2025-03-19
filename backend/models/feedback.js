//The Feedback model stores feedback provided by advisors or department heads to students on their submissions.
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Advisor or Department Head
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Student receiving feedback
    feedbackText: { type: String, required: true },
    date: { type: Date, default: Date.now }
  });
  
  const Feedback = mongoose.model('Feedback', feedbackSchema);
  module.exports = Feedback;
  