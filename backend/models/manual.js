//Manuals and guidelines that students can refer to.
const mongoose = require("mongoose");

const manualSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['documentation', 'implementation', 'policy', 'guideline'], required: true },
    content: { type: String, required: true },
    file: { type: String },  // Link to the manual file (e.g., PDF)
    createdAt: { type: Date, default: Date.now }
  });
  
  const Manual = mongoose.model('Manual', manualSchema);
  module.exports = Manual;
  