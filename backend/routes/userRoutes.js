const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  getUsersByDepartmentId,
  deleteUser,
  updateUser,
  getPremiumUsers,
  addHeadToDepartment,
  addAdvisorToDepartment,
  addStudentToDepartment,
} = require("../controllers/userController");
const {
  verifyToken,
  isAdmin,
  isAdvisor,
  isDeptHead,
  isStudent,
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
      req.params.id = req.user.department;
      getUsersByDepartmentId(req, res, next);
    });
  } else if (req.user.role === "student") {
    return isStudent(req, res, () => {
      req.params.id = req.user.department;
      getUsersByDepartmentId(req, res, next);
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
router.put("/add_head/:id", verifyToken, addHeadToDepartment);
router.put("/add_advisor/:id", verifyToken, addAdvisorToDepartment);
router.put("/add_student/:id", verifyToken, addStudentToDepartment);

module.exports = router;
