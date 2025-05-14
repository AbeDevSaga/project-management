const Department = require("../models/department");
const User = require("../models/user");


// Create a new department
const createDepartment = async (req, res) => {
  console.log("createDepartment");
  try {
    const { name, head, advisors, students } = req.body;

    const department = new Department({
      name,
      head,
      advisors,
      students,
    });

    await department.save();
    res.status(201).json({ message: "Department created successfully", department });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Department creation failed", details: error.message });
  }
};

// Update an existing department
const updateDepartment = async (req, res) => {
  console.log("updateDepartment");
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedDepartment = await Department.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("head advisors students");

    if (!updatedDepartment)
      return res.status(404).json({ message: "Department not found" });
    res
      .status(200)
      .json({
        message: "Department updated successfully",
        department: updatedDepartment,
      });
  } catch (error) {
    res.status(500).json({ message: "Failed to update department", error });
  }
};

// Delete a department
const deleteDepartment = async (req, res) => {
  console.log("deleteDepartment");
  try {
    const { id } = req.params;
    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment)
      return res.status(404).json({ message: "Department not found" });
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete department", error });
  }
};

// Get all departments
const getAllDepartments = async (req, res) => {
  console.log("getAllDepartments");
  try {
    const departments = await Department.find()
      .populate("head")
      .populate("advisors")
      .populate("students");
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Failed to get departments", error });
  }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
  console.log("getDepartmentById");
  try {
    const { id } = req.params;
    const department = await Department.findById(id)
      .populate("head")
      .populate("advisors")
      .populate("students")
      .populate("evaluators");
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: "Failed to get department", error });
  }
};

// Get department by head ID
const getDepartmentByHeadId = async (req, res) => {
  console.log("getDepartmentByHeadId");
  try {
    const { id } = req.params;
    const department = await Department.findOne({ head: id })
      .populate("head")
      .populate("advisors")
      .populate("students");

    if (!department) {
      return res.status(404).json({ message: "Department not found for this head" });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get department for head",
      error: error.message,
    });
  }
};

// Get departments by advisor ID
const getDepartmentsByAdvisorId = async (req, res) => {
  console.log("getDepartmentsByAdvisorId");
  try {
    const { id } = req.params;
    const departments = await Department.find({ advisors: id })
      .populate("head")
      .populate("advisors")
      .populate("students");

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: "No departments found for this advisor" });
    }
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get departments for advisor",
      error: error.message,
    });
  }
};

// Get departments by student ID
const getDepartmentsByStudentId = async (req, res) => {
  console.log("getDepartmentsByStudentId");
  try {
    const { id } = req.params;
    const departments = await Department.find({ students: id })
      .populate("head")
      .populate("advisors")
      .populate("students");

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: "No departments found for this student" });
    }
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get departments for student",
      error: error.message,
    });
  }
};

// Add users to a department
const addUsersToDepartment = async (req, res) => {
  console.log("addUsersToDepartment");
  try {
    const { id } = req.params;
    const { userIds, role } = req.body;
    console.log(" req.body: ",  req.body)

    // Validate input
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !role) {
      return res.status(400).json({ message: "Invalid user IDs or role provided" });
    }

    // Determine which field to update based on role
    let updateField;
    if (role === 'departmentHead') {
      updateField = { head: userIds[0] }; // Only one head allowed
    } else if (role === 'advisors' || role === 'students' || role === 'evaluators') {
      updateField = { $addToSet: { [role]: { $each: userIds } } }; // Multiple advisors or students
    } else {
      return res.status(400).json({ message: "Invalid role provided" });
    }
    console.log("updated field: ", updateField)

    // Find the department and update it
    const department = await Department.findByIdAndUpdate(
      id,
      updateField,
      { new: true }
    ).populate("head advisors students");

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Update each user's department field
    const updateUserPromises = userIds.map(userId => 
      User.findByIdAndUpdate(
        userId,
        { department: id }, // Set the department reference
        { new: true }
      )
    );

    await Promise.all(updateUserPromises);

    res.status(200).json({
      message: `${role} added to department successfully`,
      department,
    });
  } catch (error) {
    console.error(`Error adding ${role} to department:`, error);
    res.status(500).json({
      message: `Failed to add ${role} to department`,
      error: error.message,
    });
  }
};

// Remove user from department
const removeUserFromDepartment = async (req, res) => {
  console.log("removeUserFromDepartment");
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    // Validate input
    if (!userId || !role) {
      return res.status(400).json({ message: "Invalid user ID or role provided" });
    }

    // Determine which field to update based on role
    let updateField;
    if (role === 'head') {
      updateField = { head: null }; // Remove head
    } else if (role === 'advisors' || role === 'students') {
      updateField = { $pull: { [role]: userId } }; // Remove from array
    } else {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // Find the department and update it
    const department = await Department.findByIdAndUpdate(
      id,
      updateField,
      { new: true }
    ).populate("head advisors students");

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Update each user's department field
    const updateUser = await User.findByIdAndUpdate(
        userId,
        { department: id }, // Set the department reference
        { new: true }
      );

    await Promise.all(updateUserPromises);
    await Promise.all(updateUserPromises);

    res.status(200).json({
      message: `${role} removed from department successfully`,
      department,
      user: updateUser
    });
  } catch (error) {
    console.error(`Error removing ${role} from department:`, error);
    res.status(500).json({
      message: `Failed to remove ${role} from department`,
      error: error.message,
    });
  }
};

module.exports = {
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
};