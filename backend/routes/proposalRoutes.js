const express = require("express");
const router = express.Router();
const {
  createProposal,
  getAllProposals,
  getProposalById,
  getProposalsByStatus,
  deleteProposal,
  updateProposal,
  downloadProposal,
  getProposalsByStudent,
  getProposalsByProject
} = require("../controllers/proposalController");
const {
  verifyToken,
  isStudent,
  isAdvisor,
  isDeptHead,
  isAdmin
} = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../Uploads/Temp"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "temp-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Student routes
router.post("/", verifyToken, isStudent, upload.single("file"), createProposal);
router.get("/my-proposals", verifyToken, isStudent, (req, res) => {
  req.params.studentId = req.user.id;
  return getProposalsByStudent(req, res);
});

// Advisor/Department Head routes
router.get("/", verifyToken, isAdvisor, getAllProposals);
router.get("/status/:status", verifyToken, isAdvisor, getProposalsByStatus);
router.get("/student/:studentId", verifyToken, isAdvisor, getProposalsByStudent);
router.get("/project/:projectId", verifyToken, isAdvisor, getProposalsByProject);

// Shared routes
router.get("/:id", verifyToken, getProposalById);
router.get("/download/:id", downloadProposal);
router.put("/:id", verifyToken, upload.single("file"), updateProposal); // Authorization handled in controller
router.delete("/:id", verifyToken, deleteProposal); // Authorization handled in controller

module.exports = router;
