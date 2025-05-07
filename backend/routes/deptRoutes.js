const express = require("express");
const router = express.Router();
const {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  getDepartmentByHeadId,
  getDepartmentsByAdvisorId,
  getDepartmentsByStudentId,
  addUsersToDepartment,
  removeUserFromDepartment,
} = require("../controllers/departmentController");
const {
  verifyToken,
  isAdmin,
  isAdvisor,
  isDeptHead,
  isStudent,
} = require("../middlewares/authMiddleware");

// Department routes with role-based access control

// Main department route with role-based filtering
router.get("/", verifyToken, (req, res, next) => {
  if (req.user.role === "admin") {
    return isAdmin(req, res, () => {
      getAllDepartments(req, res, next);
    });
  } else if (req.user.role === "advisor") {
    return isAdvisor(req, res, () => {
      req.params.id = req.user.id;
      getDepartmentsByAdvisorId(req, res, next);
    });
  } else if (req.user.role === "student") {
    return isStudent(req, res, () => {
      req.params.id = req.user.id;
      getDepartmentsByStudentId(req, res, next);
    });
  } else if (req.user.role === "departmentHead") {
    return isDeptHead(req, res, () => {
      req.params.id = req.user.id;
      getDepartmentByHeadId(req, res, next);
    });
  } else {
    return res.status(403).json({ message: "Unauthorized access" });
  }
});

// Department creation - Admin only
router.post("/create", verifyToken, isAdmin, createDepartment);

// Department update - Admin and Department Head (for their own department)
router.put("/update/:id", verifyToken, (req, res, next) => {
  if (req.user.role === "admin") {
    return updateDepartment(req, res, next);
  } else if (req.user.role === "departmentHead") {
    // Verify the department head is updating their own department
    Department.findById(req.params.id)
      .then(dept => {
        if (dept.head.toString() === req.user.id) {
          return updateDepartment(req, res, next);
        } else {
          return res.status(403).json({ message: "Can only update your own department" });
        }
      })
      .catch(err => res.status(500).json({ message: "Department not found", error: err }));
  } else {
    return res.status(403).json({ message: "Unauthorized access" });
  }
});

// User management routes - Admin and Department Head (for their own department)
router.put("/add-users/:id", verifyToken, (req, res, next) => {
  if (req.user.role === "admin") {
    return addUsersToDepartment(req, res, next);
  } else if (req.user.role === "departmentHead") {
    // Verify the department head is managing their own department
    Department.findById(req.params.id)
      .then(dept => {
        if (dept.head.toString() === req.user.id) {
          return addUsersToDepartment(req, res, next);
        } else {
          return res.status(403).json({ message: "Can only manage your own department" });
        }
      })
      .catch(err => res.status(500).json({ message: "Department not found", error: err }));
  } else {
    return res.status(403).json({ message: "Unauthorized access" });
  }
});

router.put("/remove-user/:id", verifyToken, (req, res, next) => {
  if (req.user.role === "admin") {
    return removeUserFromDepartment(req, res, next);
  } else if (req.user.role === "departmentHead") {
    // Verify the department head is managing their own department
    Department.findById(req.params.id)
      .then(dept => {
        if (dept.head.toString() === req.user.id) {
          return removeUserFromDepartment(req, res, next);
        } else {
          return res.status(403).json({ message: "Can only manage your own department" });
        }
      })
      .catch(err => res.status(500).json({ message: "Department not found", error: err }));
  } else {
    return res.status(403).json({ message: "Unauthorized access" });
  }
});

// Department deletion - Admin only
router.delete("/delete/:id", verifyToken, isAdmin, deleteDepartment);

// Get specific department - Accessible by admin or members of the department
router.get("/:id", verifyToken, (req, res, next) => {
  if (req.user.role === "admin") {
    return getDepartmentById(req, res, next);
  } else {
    // For non-admins, verify they belong to the department
    Department.findById(req.params.id)
      .then(dept => {
        if (!dept) return res.status(404).json({ message: "Department not found" });
        
        const isMember = 
          dept.head.toString() === req.user.id ||
          dept.advisors.some(advisor => advisor.toString() === req.user.id) ||
          dept.students.some(student => student.toString() === req.user.id);
        
        if (isMember) {
          return getDepartmentById(req, res, next);
        } else {
          return res.status(403).json({ message: "Not a member of this department" });
        }
      })
      .catch(err => res.status(500).json({ message: "Error finding department", error: err }));
  }
});

module.exports = router;