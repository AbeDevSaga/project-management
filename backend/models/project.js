//This model will store project details, tracking progress, proposals, and submissions.
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    projectStatus: { type: String, enum: ['approved', 'rejected', 'in-progress', 'completed'], default: 'in-progress' },
    tasks: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
    ],
    proposals: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' }  // Link to the proposals for this project
    ],
    submissions: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }  // Link to the submissions for this project
    ],
    createdAt: { type: Date, default: Date.now }
  });
  
  const Project = mongoose.model('Project', projectSchema);
  module.exports = Project;
  