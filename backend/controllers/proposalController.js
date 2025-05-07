const Proposal = require("../models/proposal");
const Project = require("../models/project");
const fs = require("fs");
const path = require("path");

const createProposal = async (req, res) => {
  console.log("createProposal");
  try {
    const { project, feedback, similarityScore } = req.body;
    console.log(
      "project: ", project, 
      "feedback: ", feedback, 
      "similarityScore: ", similarityScore,
    )
    const student = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Define paths
    const proposalsBaseDir = path.join(__dirname, '..', 'Uploads', 'Proposals');
    const proposalDir = path.join(proposalsBaseDir, project.toString());
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(proposalDir)) {
      fs.mkdirSync(proposalDir, { recursive: true });
    }

    // Generate unique filename
    const fileExt = path.extname(req.file.originalname);
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExt}`;
    const filePath = path.join('Proposals', project.toString(), uniqueFilename);
    const fullPath = path.join(proposalDir, uniqueFilename);

    // Verify temp file exists before moving
    if (!fs.existsSync(req.file.path)) {
      throw new Error('Temporary file not found');
    }

    // Move file (use promises for async/await)
    await fs.promises.rename(req.file.path, fullPath);

    const proposal = new Proposal({
      student,
      project,
      file: filePath,
      feedback,
      similarityScore,
    });

    await proposal.save();

    // Add proposal to project
    await Project.findByIdAndUpdate(project, {
      $push: { proposal: proposal._id },
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
    console.error('Proposal creation error:', error);
    
    // Clean up files if error occurs
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('Failed to clean up temp file:', cleanupError);
      }
    }

    res.status(400).json({
      error: "Proposal creation failed",
      details: error.message,
    });
  }
};

const updateProposal = async (req, res) => {
  console.log("updateProposal")
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
  console.log("deleteProposal")
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
      $pull: { proposal: proposal._id },
    });
    res.status(200).json({ message: "Proposal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete proposal", error });
  }
};

const getAllProposals = async (req, res) => {
  console.log("getAllProposals")
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
  console.log("getProposalById")
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
  console.log("downloadProposal")
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
  console.log("getProposalsByStatus")
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
  console.log("getProposalsByStudent")
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
  console.log("getProposalByProject")
  try {
    const { projectId } = req.params;
    const proposal = await Proposal.findOne({ project: projectId })
      .populate("student")
      .sort({ date: -1 });
    res.status(200).json(proposal);
  } catch (error) {
    res.status(500).json({ message: "Failed to get project proposal", error });
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
