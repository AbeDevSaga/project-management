const Proposal = require("../models/proposal");
const Project = require("../models/project");
const fs = require("fs");
const path = require("path");

// Ensure the uploads directory exists
const proposalsBaseDir = path.join(__dirname, "..", "Uploads", "Proposals");
if (!fs.existsSync(proposalsBaseDir)) {
  fs.mkdirSync(proposalsBaseDir, { recursive: true });
}

const createProposal = async (req, res) => {
  try {
    const { project, feedback, similarityScore } = req.body;
    const student = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Create proposal-specific directory
    const proposalDir = path.join(proposalsBaseDir, student.toString());
    if (!fs.existsSync(proposalDir)) {
      fs.mkdirSync(proposalDir, { recursive: true });
    }

    // Generate unique filename
    const originalFilename = req.file.originalname;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${originalFilename}`;
    const filePath = path.join("Proposals", student.toString(), filename);
    const fullPath = path.join(proposalDir, filename);

    // Move the file from temp location to permanent storage
    fs.renameSync(req.file.path, fullPath);

    const proposal = new Proposal({
      student,
      project,
      file: filePath,
      feedback,
      similarityScore,
    });

    await proposal.save();

    //Add proposal to its project's proposals array
    await Project.findByIdAndUpdate(project, {
      $push: { proposals: proposal._id },
    });

    res.status(201).json({
      message: "Proposal created successfully",
      proposal: {
        id: proposal._id,
        student: proposal.student,
        status: proposal.status,
        file: proposal.file,
      },
    });
  } catch (error) {
    // Clean up uploaded file if proposal creation fails
    if (req.file && req.file.path) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
    res.status(400).json({
      error: "Proposal creation failed",
      details: error.message,
    });
  }
};

const updateProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    const updates = { status, feedback };

    // Only allow file update if the user is the student who created it
    if (req.file && req.user.id === req.proposal.student.toString()) {
      const proposal = await Proposal.findById(id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      // Delete old file
      if (proposal.file) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "Uploads",
          proposal.file
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Create new file path
      const studentDir = path.join(proposalsBaseDir, req.user.id);
      if (!fs.existsSync(studentDir)) {
        fs.mkdirSync(studentDir, { recursive: true });
      }

      const filename = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join("Proposals", req.user.id, filename);
      const fullPath = path.join(studentDir, filename);

      fs.renameSync(req.file.path, fullPath);
      updates.file = filePath;
    }

    // If updating status, record who approved/rejected it
    if (status && ["approved", "rejected"].includes(status)) {
      updates.approvedBy = req.user.id;
    }

    const updatedProposal = await Proposal.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("student project approvedBy");

    if (!updatedProposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json({
      message: "Proposal updated successfully",
      proposal: updatedProposal,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update proposal", error });
  }
};

const deleteProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id);

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    // Only allow deletion by student who created it or admin
    if (
      proposal.student.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this proposal" });
    }

    // Delete the associated file
    if (proposal.file) {
      const filePath = path.join(__dirname, "..", "Uploads", proposal.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Proposal.findByIdAndDelete(id);
    //Remove proposal from its project's proposals array
    await Project.findByIdAndUpdate(proposal.project, {
      $pull: { proposals: proposal._id },
    });
    res.status(200).json({ message: "Proposal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete proposal", error });
  }
};

const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate("student project approvedBy")
      .sort({ date: -1 });
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Failed to get proposals", error });
  }
};

const getProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id).populate(
      "student project approvedBy"
    );
    if (!proposal)
      return res.status(404).json({ message: "Proposal not found" });
    res.status(200).json(proposal);
  } catch (error) {
    res.status(500).json({ message: "Failed to get proposal", error });
  }
};

const downloadProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id);

    if (!proposal || !proposal.file) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    const filePath = path.join(__dirname, "../Uploads", proposal.file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Get the original filename
    const filename = path.basename(proposal.file);

    // Set proper headers
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf"); // Adjust based on actual file type

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (err) => {
      console.error("File stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error streaming file" });
      }
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Download failed" });
  }
};

const getProposalsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const proposals = await Proposal.find({ status })
      .populate("student project")
      .sort({ date: -1 });
    if (!proposals || proposals.length === 0) {
      return res.status(404).json({ message: `No ${status} proposals found` });
    }
    res.status(200).json(proposals);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get proposals by status", error });
  }
};

const getProposalsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const proposals = await Proposal.find({ student: studentId })
      .populate("project")
      .sort({ date: -1 });
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Failed to get student proposals", error });
  }
};

const getProposalsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const proposals = await Proposal.find({ project: projectId })
      .populate("student")
      .sort({ date: -1 });
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Failed to get project proposals", error });
  }
};

module.exports = {
  createProposal,
  updateProposal,
  deleteProposal,
  getAllProposals,
  getProposalById,
  downloadProposal,
  getProposalsByStatus,
  getProposalsByStudent,
  getProposalsByProject,
};
