const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  getUsersByOrganizationId,
  getUsersByDepartmentId,
  deleteUser,
  updateUser,
  getPremiumUsers,
} = require("../controllers/userController");
const {
  verifyToken,
  isAdmin,
  isAdvisor,
  isDeptHead,
} = require("../middlewares/authMiddleware");

// SuperAdmin only Basic Routes
router.post("/create_user", verifyToken, isAdmin, createUser);

router.get("/", verifyToken, (req, res, next) => {
  if (req.user.role === "admin") {
    return isAdmin(req, res, () => {
      getAllUsers(req, res, next);
    });
  } else if (req.user.role === "advisor") {
    return isAdvisor(req, res, () => {
      req.params.id = req.user.id;
      getProjectsByAdvisorId(req, res, next);
    });
  } else if (req.user.role === "departmentHead") {
    return isDeptHead(req, res, () => {
      req.params.id = req.user.department;
      getUsersByDepartmentId(req, res, next);
    });
  } else {
    return res.status(403).json({ message: "Unauthorized access" });
  }
});
router.get("/premium_users", verifyToken, getPremiumUsers);
router.get("/department/:id", verifyToken, getUsersByDepartmentId);
router.put("/update_user/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/:id", verifyToken, getUserById);

module.exports = router;
