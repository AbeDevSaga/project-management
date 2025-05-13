const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin, isAdvisor } = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");
const { uploadProjectFile, getProjectFiles, downloadProjectFile } = require("../controllers/fileController");

// Configure multer storage for project files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, "../Uploads/ProjectFiles");
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


// File routes
router.post("/:id/files", verifyToken, upload.single("file"), uploadProjectFile);
router.get("/:id/files/:fileId/download", downloadProjectFile);

router.get("/:id", verifyToken, getProjectFiles);

module.exports = router;