const Project = require("../models/project");
const File = require("../models/file");
const fs = require("fs");
const path = require("path");

const uploadProjectFile = async (req, res) => {
    console.log("uploadProjectFile");
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      // Clean up uploaded file if project not found
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "Project not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = new File({
      projectId: project._id,
      name: req.file.originalname,
      path: req.file.path,
      type: getFileType(req.file.mimetype),
      uploadedBy: req.user.id,
    });

    await file.save();

    // Add file reference to project's files array
    project.files.push(file._id);
    await project.save();

    res.status(200).json({
      message: "File uploaded successfully",
      file: file,
    });
  } catch (error) {
    // Clean up uploaded file if something went wrong
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({
      error: "File upload failed",
      details: error.message,
    });
  }
};

const getProjectFiles = async (req, res) => {
    console.log("getProjectFiles");
  try {
    const project = await Project.findById(req.params.id).populate("files");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      files: project.files,
      proposal: project.proposal,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to get project files",
      details: error.message,
    });
  }
};

const downloadProjectFile = async (req, res) => {
  console.log("downloadProjectFile");
  try {
    const file = await File.findOne({
      _id: req.params.fileId,
      projectId: req.params.id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(file.path, file.name);
  } catch (error) {
    res.status(400).json({
      error: "File download failed",
      details: error.message,
    });
  }
};

// Helper function to determine file type
const getFileType = (mimeType) => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "document";
  if (mimeType.includes("presentation")) return "presentation";
  if (mimeType.includes("word") || mimeType.includes("document"))
    return "document";
  if (mimeType.includes("zip") || mimeType.includes("compressed"))
    return "archive";
  return "other";
};

module.exports = {
  uploadProjectFile,
  downloadProjectFile,
  getProjectFiles,
  getFileType,
};
