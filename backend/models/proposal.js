//The Proposal model stores information about project proposals submitted by students
const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  proposalDate: { type: Date, default: Date.now },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Department Head
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  proposalFile: { type: String }, // File location for the proposal
  feedback: String, // Feedback from the advisor/department head
  similarityScore: { type: Number }, // Similarity score for checking duplication
});

const Proposal = mongoose.model(
  "Proposal",
  proposalSchema
);
module.exports = Proposal;
