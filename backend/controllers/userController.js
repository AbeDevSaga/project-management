const User = require("../models/user");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  console.log("createUser");
  try {
    const { username, email,phone, password, role, department } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      role,
      department
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Registration failed", details: error.message });
  }
};

const updateUser = async (req, res) => {
  console.log("updateUser");
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      message: "User updated successfully",
      User: updateUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update User", error });
  }
};

const deleteUser = async (req, res) => {
  console.log("deleteUser");
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete User", error });
  }
};

const getAllUsers = async (req, res) => {
  console.log("getAllUsers");
  try {
    const users = await User.find()
      .populate("department")
      .populate("project")
      .populate("advisor")
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users", error });
  }
};

const getUserById = async (req, res) => {
  console.log("getUserById");
  try {
    const { id } = req.params;
    const user = await User.findById(id)
    .populate("department")
      .populate("project")
      .populate("advisor")
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get User", error });
  }
};

const getUsersByOrganizationId = async (req, res) => {
  console.log("getUsersByOrganizationId");
  try {
    const { id } = req.params;
    const users = await User.find({ organization: id });
    if (!users) return res.status(404).json({ message: "User not found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get User", error });
  }
};

const getUsersByDepartmentId = async (req, res) => {
  console.log("getUsersByDepartmentId");
  try {
    const { id } = req.params;
    const users = await User.find({ department: id })
    .populate("department")
      .populate("project")
      .populate("advisor");
    if (!users) return res.status(404).json({ message: "User not found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get User", error });
  }
};

const getPremiumUsers = async (req, res) => {
  console.log("get premium");
  try {
    const premiumUsers = await User.find({ isPremium: true });
    if (!premiumUsers)
      return res.status(404).json({ message: "Premium Users not found" });
    res.status(200).json(premiumUsers);
  } catch (error) {
    res.status(500).json({ message: "Failed to get Premium Users", error });
  }
};
const addHeadToDepartment = async (req, res) => {
  try {
    const { departmentId, userId } = req.params;

    // 1. Verify the user exists and has departmentHead role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "departmentHead") {
      return res.status(400).json({ message: "User must be a department head" });
    }

    // 2. Verify the department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // 3. Check if the user is already head of another department
    const existingDepartment = await Department.findOne({ head: userId });
    if (existingDepartment && existingDepartment._id.toString() !== departmentId) {
      return res.status(400).json({ 
        message: "User is already head of another department" 
      });
    }

    // 4. Update the department with new head
    department.head = userId;
    await department.save();

    // 5. Update the user's department reference
    user.department = departmentId;
    await user.save();

    res.status(200).json({ 
      message: "Department head assigned successfully",
      department 
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Failed to assign department head",
      error: error.message 
    });
  }
};

const addAdvisorToDepartment = async (req, res) => {
  try {
    const { departmentId, userId } = req.params;

    // 1. Verify the user exists and has advisor role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "advisor") {
      return res.status(400).json({ message: "User must be an advisor" });
    }

    // 2. Verify the department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // 3. Check if advisor is already in this department
    if (department.advisors.includes(userId)) {
      return res.status(400).json({ 
        message: "Advisor is already in this department" 
      });
    }

    // 4. Add advisor to department
    department.advisors.push(userId);
    await department.save();

    // 5. Update the user's department reference
    user.department = departmentId;
    await user.save();

    res.status(200).json({ 
      message: "Advisor added to department successfully",
      department 
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Failed to add advisor to department",
      error: error.message 
    });
  }
};

const addStudentToDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { studentIds } = req.body;

    // 1. Verify the department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // 2. Verify all users exist and are students
    const students = await User.find({ 
      _id: { $in: studentIds },
      role: "student" 
    });

    if (students.length !== studentIds.length) {
      const invalidIds = studentIds.filter(id => 
        !students.some(student => student._id.toString() === id)
      );
      return res.status(400).json({ 
        message: "Some users are not valid students",
        invalidIds 
      });
    }

    // 3. Filter out students already in this department
    const newStudents = studentIds.filter(id => 
      !department.students.includes(id)
    );

    if (newStudents.length === 0) {
      return res.status(400).json({ 
        message: "All students are already in this department" 
      });
    }

    // 4. Add students to department
    department.students.push(...newStudents);
    await department.save();

    // 5. Update all students' department references
    await User.updateMany(
      { _id: { $in: newStudents } },
      { $set: { department: departmentId } }
    );

    res.status(200).json({ 
      message: "Students added to department successfully",
      addedCount: newStudents.length,
      department 
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Failed to add students to department",
      error: error.message 
    });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUsersByOrganizationId,
  getUsersByDepartmentId,
  getPremiumUsers,
  addHeadToDepartment,
  addAdvisorToDepartment,
  addStudentToDepartment,
};