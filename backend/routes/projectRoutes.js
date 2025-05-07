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
router.post("/create", verifyToken, createProject);
router.put("/update/:id", verifyToken, updateProject);
router.put("/add-students/:id", verifyToken, addStudentsToProject);
router.put("/add-user/:id", verifyToken, addUserToProject);
router.delete("/delete/:id", verifyToken, deleteProject);
router.get("/:id", verifyToken, getProjectById);

module.exports = router;
