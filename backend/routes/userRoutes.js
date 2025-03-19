const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById, getUsersByOrganizationId, deleteUser, updateUser, getPremiumUsers } = require('../controllers/userController');
const { verifyToken, isAdmin, isAdvisor, isDeptHead  } = require('../middlewares/authMiddleware');


// SuperAdmin only Basic Routes
router.post('/create_user', verifyToken, isAdmin, createUser);


// Admin and Super Admin Basic Routes
router.get("/",verifyToken, allowAdmins, getAllUsers);
router.put("/update_user/:id", verifyToken, allowAdmins, updateUser);
router.delete("/delete/:id", verifyToken, allowAdmins, deleteUser);
router.get("/:id",verifyToken, allowAdmins, getUserById);

module.exports = router;