//Manuals and guidelines that students can refer to.
const mongoose = require("mongoose");

const manualSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['documentation', 'implementation', 'policy', 'guideline'], default: 'documentation' },
    file: { type: String },  // Link to the manual file (e.g., PDF)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link to the user who created the manual
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" }, // Link to the department associated with the manual
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  const Manual = mongoose.model('Manual', manualSchema);
  module.exports = Manual;
  