const express = require("express");
const router = express.Router();
const {
  verifyToken,
  isAdmin,
  isAdvisor,
} = require("../middlewares/authMiddleware");
const {
  createNotification,
  getUserNotifications,
  updateNotificationStatus,
  deleteNotification,
  markAllAsRead,
} = require("../controllers/notificationController");

// File routes
router.get("/", verifyToken, getUserNotifications);
router.post("/create", verifyToken, createNotification);
router.post("/:id/status", verifyToken, updateNotificationStatus);
router.post("/:id/mark-all-read", verifyToken, markAllAsRead);
router.delete("/:id", verifyToken, deleteNotification);

module.exports = router;
