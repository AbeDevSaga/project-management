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
  evaluation: [
    {
      evaluator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: {
        type: String,
        enum: ["not-evaluated", "evaluated"],
        default: "not-evaluated",
      },
      date: { type: Date, default: Date.now },
      form: {
        type: Map, 
        of: String,
        default: {},
      },
      comment: { type: String },
    },
  ],
  isApproved: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
