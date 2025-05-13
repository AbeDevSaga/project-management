const express = require("express");
const router = express.Router();
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


// SuperAdmin only Basic Routes

// Admin and Super Admin Basic Routes
router.get("/", verifyToken, (req, res, next) => {
  if (req.user.role === "admin") {
    return isAdmin(req, res, () => {
      getAllProjects(req, res, next);
    });
  } else if (req.user.role === "advisor") {
    return isAdvisor(req, res, () => {
      req.params.id = req.user.id;
      getProjectsByAdvisorId(req, res, next);
    });
  } else if (req.user.role === "student") {
    return isStudent(req, res, () => {
      req.params.id = req.user.id;
      getProjectsByStudentId(req, res, next);
    });
  } else if (req.user.role === "departmentHead") {
    return isDeptHead(req, res, () => {
      req.params.id = req.user.department;
      getProjectsByDepartmentId(req, res, next);
    });
  } else {
    return res.status(403).json({ message: "Unauthorized access" });
  }
});
router.post("/create", verifyToken, upload.single("description"), createProject);
router.put("/update/:id", verifyToken, updateProject);
router.put("/add-students/:id", verifyToken, addStudentsToProject);
router.put("/add-user/:id", verifyToken, addUserToProject);
router.delete("/delete/:id", verifyToken, deleteProject);
router.get("/:id", verifyToken, getProjectById);

module.exports = router;
