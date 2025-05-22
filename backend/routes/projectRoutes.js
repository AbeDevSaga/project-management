const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectsByDepartmentId,
  getProjectsByStudentId,
  getProjectsByAdvisorId,
  getProjectsByStatus,
  addStudentsToProject,
  addUserToProject,
  addEvaluatorsToProject,
  addEvaluationToProject,
} = require("../controllers/projectController");
const {
  verifyToken,
  isAdmin,
  isAdvisor,
  isDeptHead,
  isStudent,
} = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");

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

// Route handler with proper middleware chaining
router.get("/", verifyToken, async (req, res, next) => {
  try {
    const { role, id } = req.user;

    if (role === "admin") {
      // Only check admin role, don't send response
      await isAdmin(req, res, () => {});
      return getAllProjects(req, res, next);
    } else if (role === "advisor") {
      // Only check advisor role, don't send response
      await isAdvisor(req, res, () => {});
      req.params.id = id;
      return getProjectsByAdvisorId(req, res, next);
    } else if (role === "student") {
      // Only check student role, don't send response
      await isStudent(req, res, () => {});
      req.params.id = id;
      return getProjectsByStudentId(req, res, next);
    } else if (role === "departmentHead") {
      // Only check dept head role, don't send response
      await isDeptHead(req, res, () => {});
      const user = await User.findById(id);
      console.log("user: ", user)
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.params.id = user.department.toString();
      return getProjectsByDepartmentId(req, res, next);
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    next(error);
  }
});

// Other routes
router.post("/create", verifyToken, upload.single("description"), createProject);
router.put("/update/:id", verifyToken, updateProject);
router.put("/add-evaluation/:id", verifyToken, addEvaluationToProject);
router.put("/add-students/:id", verifyToken, addStudentsToProject);
router.put("/add-evaluators/:id", verifyToken, addEvaluatorsToProject);
router.put("/add-user/:id", verifyToken, addUserToProject);
router.delete("/delete/:id", verifyToken, deleteProject);
router.get("/:id", verifyToken, getProjectById);

module.exports = router;