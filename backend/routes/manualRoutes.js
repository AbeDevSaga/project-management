const express = require("express");
const User = require("../models/user");
const router = express.Router();
const {
  createManual,
  getAllManuals,
  getManualById,
  getManualsByType,
  deleteManual,
  updateManual,
  downloadManual,
  getRecentManuals,
  getManualsByDepartment,
} = require("../controllers/manualController");
const {
  verifyToken,
  isAdmin,
  isAdvisor,
  isDeptHead,
} = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../Uploads/Manuals"));
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
    const allowedTypes = [".pdf", ".doc", ".docx", ".txt", ".ppt", ".pptx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only document files are allowed!"), false);
    }
  },
});

router.get("/", verifyToken, async (req, res, next) => {
  try {
    const { role, id } = req.user;
    if (role === "admin") {
      // Only check admin role, don't send response
      await isAdmin(req, res, () => {});
      return getAllManuals(req, res, next);
    } else if (
      role === "advisor" ||
      role === "student" ||
      role === "departmentHead"
    ) {
      const user = await User.findById(id);
      console.log("user: ", user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.params.id = user.department.toString();
      return getManualsByDepartment(req, res, next);
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    next(error);
  }
});
router.post("/", verifyToken, isDeptHead, upload.single("file"), createManual);
router.get("/recent", verifyToken, getRecentManuals);
router.get("/type/:type", verifyToken, getManualsByType);
router.get("/:id", verifyToken, getManualById);
router.get("/download/:id", downloadManual);
router.put("/:id", verifyToken, isAdmin, upload.single("file"), updateManual);
router.delete("/:id", verifyToken, isAdmin, deleteManual);

module.exports = router;
