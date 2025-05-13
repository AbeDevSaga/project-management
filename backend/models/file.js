// These model will store files of a project
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  name: { type: String, required: true },
  path: { type: String, required: true },
  type: { type: String, required: true }, // e.g., "document", "image", "video"
  property: {type: String, default: "files" },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
