const express = require("express");
const router = express.Router();
const {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectsByDepartmentId,
  getProjectsByStatus,
} = require("../controllers/projectController");
const {
  verifyToken,
  isAdmin,
  isAdvisor,
  isDeptHead,
} = require("../middlewares/authMiddleware");

// SuperAdmin only Basic Routes

// Admin and Super Admin Basic Routes
router.get("/", verifyToken, getAllProjects);
router.put("/create", verifyToken, createProject);
router.put("/update/:id", verifyToken, updateProject);
router.delete("/delete/:id", verifyToken, deleteProject);
router.get("/:id", verifyToken, getProjectById);

module.exports = router;
