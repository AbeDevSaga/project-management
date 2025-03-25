const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById, getUsersByOrganizationId, deleteUser, updateUser, getPremiumUsers } = require('../controllers/userController');
const { verifyToken, isAdmin, isAdvisor, isDeptHead  } = require('../middlewares/authMiddleware');


// SuperAdmin only Basic Routes
router.post('/create_user', verifyToken, isAdmin, createUser);


// Admin and Super Admin Basic Routes
router.get("/",verifyToken,  getAllUsers);
router.put("/update_user/:id", verifyToken,  updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/:id",verifyToken, getUserById);

module.exports = router;