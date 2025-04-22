const express = require("express");
const router = express.Router();
const {
  verifyToken,
  isAdmin,
  isAdvisor,
  isDeptHead,
} = require("../middlewares/authMiddleware");
const {
  createTasks,
  updateTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  getTasksByProjectId,
  getTasksByStatus,
  getTasksByAssignedUser,
} = require("../controllers/taskController");

// Define your routes here
router.get("/", (req, res) => {
  res.send("Task Route Working");
});

// SuperAdmin only Basic Routes

// Admin and Super Admin Basic Routes
router.get("/", verifyToken, getAllTasks);
router.post("/create", verifyToken, createTasks);
router.put("/update/:id", verifyToken, updateTask);
router.delete("/delete/:id", verifyToken, deleteTask);
router.get("/project/:projectId", verifyToken, getTasksByProjectId);
router.get("/status/:status", verifyToken, getTasksByStatus);
router.get("/assigned/:id", verifyToken, getTasksByAssignedUser);
router.get("/:id", verifyToken, getTaskById);

module.exports = router;
