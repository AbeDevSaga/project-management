const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getProjectMessages,
  getMessageById,
  deleteMessage
} = require("../controllers/messageController");

const multer = require("multer");
const path = require("path");
// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, "../Uploads/ChatFiles");
    if (req.params.id) {
      uploadPath = path.join(uploadPath, req.params.id);
    }
    require("fs").mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".zip", ".jpg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only document, image, and archive files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});



const { verifyToken } = require("../middlewares/authMiddleware");

// Send a message to a project
router.post("/send", verifyToken, upload.single("file"), sendMessage);

// Get all messages for a project
router.get("/project/:projectId", verifyToken, getProjectMessages);

// Get a specific message
router.get("/:messageId", verifyToken, getMessageById);

// Delete a message
router.delete("/:messageId", verifyToken, deleteMessage);

module.exports = router;