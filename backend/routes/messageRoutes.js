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
    cb(null, path.join(__dirname, "../Uploads/ChatFiles"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only document files are allowed!'), false);
    }
  }
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