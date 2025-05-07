const express = require("express");
const router = express.Router();
const {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAllSchedules,
  getScheduleById,
  getSchedulesByProject,
  getSchedulesByUser,
  getUpcomingSchedules,
} = require("../controllers/scheduleController");
const {
  verifyToken,
  isAdmin,
  isAdvisor,
  isDeptHead,
  isStudent,
} = require("../middlewares/authMiddleware");


router.post("/", verifyToken, isAdvisor, createSchedule);
router.get("/project/:projectId", verifyToken, getSchedulesByProject);

router.get("/user/:userId", verifyToken, isAdvisor || isStudent, getSchedulesByUser);
router.get("/upcoming/all", verifyToken, getUpcomingSchedules);
router.put("/:id", verifyToken, isAdvisor, updateSchedule);
router.delete("/:id", verifyToken, isAdvisor, deleteSchedule);
router.get("/", verifyToken, getAllSchedules);
router.get("/:id", verifyToken, getScheduleById);

module.exports = router;