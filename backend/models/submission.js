//The Submission model handles the progress and final submissions made by students.
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  submissionDate: { type: Date, default: Date.now },
  submissionType: {
    type: String,
    enum: ["proposal", "progress", "final"],
    required: true,
  }, // Type of submission (proposal, progress report, final submission)
  documentFile: { type: String }, // File location for the submission
  feedback: String, // Feedback from the advisor or department head
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  }, // Submission approval status
  version: { type: Number, default: 1 }, // Version number for document tracking
});

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
