const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    password: { type: String, required: true },
    userId: { type: String, unique: true, sparse: true },
    role: {
      type: String,
      enum: ["admin", "student", "advisor", "departmentHead"],
      default: "student"
    },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    advisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    profileImage: { type: String, default: "" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // Projects assigned to the user
    proposals: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Proposal" }, // Proposals submitted by the student
    ],
    submissions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Submission" }, // Submissions of progress/final reports
    ],
    visitHistory: [{ date: Date, advisorId: mongoose.Schema.Types.ObjectId }],
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
