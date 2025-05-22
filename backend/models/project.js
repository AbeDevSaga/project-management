//This model will store project details, tracking progress, proposals, and submissions.
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  projectStatus: {
    type: String,
    enum: ["in-progress", "completed"],
    default: "in-progress",
  },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal" },

  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  students: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link to the students for this project
  ],
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link to the advsior for this project
  submissions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Submission" }, // Link to the submissions for this project
  ],
  evaluators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Link to the evaluators for this project
  evaluations: [
    {
      evaluator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
      presentation: { type: Number, min: 0, max: 6 },
      knowledgeDomain: { type: Number, min: 0, max: 6 },
      knowledgeMethodology: { type: Number, min: 0, max: 6 },
      questionConfidence: { type: Number, min: 0, max: 7 },
      contentClarity: { type: Number, min: 0, max: 3 },
      problemStatement: { type: Number, min: 0, max: 5 },
      objectivesSignificance: { type: Number, min: 0, max: 5 },
      projectMethodology: { type: Number, min: 0, max: 4 },
      useCaseDiagram: { type: Number, min: 0, max: 5 },
      sequenceActivityDiagram: { type: Number, min: 0, max: 5 },
      classDiagram: { type: Number, min: 0, max: 4 },
      persistenceDiagram: { type: Number, min: 0, max: 4 },
      totalMarks: { type: Number },
      comments: { type: String },
    },
  ],
  isApproved: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
