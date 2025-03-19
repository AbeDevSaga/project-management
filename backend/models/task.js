//This model stores tasks assigned to students within a project.
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    taskName: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['leader', 'member'], required: true },
    contribution: { type: String },
    deadline: { type: Date },
    completed: { type: Boolean, default: false }
  });
  
  const Task = mongoose.model('Task', taskSchema);
  module.exports = Task;
  