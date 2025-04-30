//This model stores tasks assigned to students within a project.
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  taskName: { type: String, required: true },
  discription: { type: String },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: {
    type: String,
    enum: ["not-started", "in-progress", "completed", "aproved", "rejected"],
    default: "not-started",
  },
  startDate: { type: Date },
  endDate: { type: Date },
  percentage: { type: String, default: "0%" }
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
