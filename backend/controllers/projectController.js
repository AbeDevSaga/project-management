const Project = require("../models/project");

// Create a new project
const createProject = async (req, res) => {
  console.log("createProject");
  try {
    const {
      title,
      description,
      department,
      projectStatus,
      tasks,
      proposals,
      students,
      advisor,
      submissions,
    } = req.body;

    const project = new Project({
      title,
      description,
      department,
      projectStatus,
      tasks,
      proposals,
      students,
      advisor,
      submissions,
    });

    await project.save();
    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Project creation failed", details: error.message });
  }
};

// Update an existing project
const updateProject = async (req, res) => {
  console.log("updateProject");
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedProject = await Project.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedProject)
      return res.status(404).json({ message: "Project not found" });
    res
      .status(200)
      .json({
        message: "Project updated successfully",
        project: updatedProject,
      });
  } catch (error) {
    res.status(500).json({ message: "Failed to update project", error });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  console.log("deleteProject");
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject)
      return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project", error });
  }
};

// Get all projects
const getAllProjects = async (req, res) => {
  console.log("getAllProjects");
  try {
    const projects = await Project.find()
      .populate("students")
      .populate("advisor")
      .populate("department")
      .populate("proposal");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to get projects", error });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  console.log("getProjectById");
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate("students")
      .populate("advisor")
      .populate("department")
      .populate("proposal");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to get project", error });
  }
};

// Get projects by department ID
const getProjectsByDepartmentId = async (req, res) => {
  console.log("getProjectsByDepartmentId");
  try {
    const { id } = req.params;
    const projects = await Project.find({ department: id })
      .populate("students")
      .populate("advisor")
      .populate("department")
      .populate("proposal");

    if (!projects)
      return res
        .status(404)
        .json({ message: "Projects not found for this department" });
    res.status(200).json(projects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get projects for department", error });
  }
};

// Get projects by Student ID
const getProjectsByStudentId = async (req, res) => {
  console.log("getProjectsByStudentId");
  try {
    const { id } = req.params;
    const projects = await Project.find({
      students: id, // Changed from department to students
    })
      .populate("students")
      .populate("advisor")
      .populate("department")
      .populate("proposal");

    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this student" });
    }
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get projects for student",
      error: error.message,
    });
  }
};

// Get projects by Advisor ID
const getProjectsByAdvisorId = async (req, res) => {
  console.log("getProjectsByAdvisorId");
  try {
    const { id } = req.params;
    const projects = await Project.find({
      advisor: id, // Changed from department to advisor
    })
      .populate("students")
      .populate("advisor")
      .populate("department")
      .populate("proposal");

    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this advisor" });
    }
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get projects for advisor",
      error: error.message,
    });
  }
};

// Get projects by status
const getProjectsByStatus = async (req, res) => {
  console.log("getProjectsByStatus");
  try {
    const { status } = req.params;
    const projects = await Project.find({ projectStatus: status })
      .populate("students")
      .populate("advisor")
      .populate("proposal");

    if (!projects)
      return res
        .status(404)
        .json({ message: "No projects found with this status" });
    res.status(200).json(projects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get projects by status", error });
  }
};

// Add students to a project
const addStudentsToProject = async (req, res) => {
  console.log("addStudentsToProject");
  try {
    const { id } = req.params;
    const { studentIds } = req.body;

    // Validate input
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "Invalid student IDs provided" });
    }

    // Find the project and update it
    const project = await Project.findByIdAndUpdate(
      id,
      { $addToSet: { students: { $each: studentIds } } }, // Using $addToSet to avoid duplicates
      { new: true }
    ).populate("students");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Students added to project successfully",
      project,
    });
  } catch (error) {
    console.error("Error adding students to project:", error);
    res.status(500).json({
      message: "Failed to add students to project",
      error: error.message,
    });
  }
};
// Add students to a project
const addUserToProject = async (req, res) => {
  console.log("add UserToProject");
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    // Validate input
    if (!userId || !role) {
      return res
        .status(400)
        .json({ message: "Invalid user ID or role provided" });
    }

    // Find the project and update it
    const project = await Project.findByIdAndUpdate(
      id,
      { $addToSet: { [role]: userId } }, // Using $addToSet to avoid duplicates
      { new: true }
    ).populate(role);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: `${role} added to project successfully`,
      project,
    });
  } catch (error) {
    console.error(`Error adding ${role} to project:`, error);
    res.status(500).json({
      message: `Failed to add ${role} to project`,
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectsByDepartmentId,
  getProjectsByStudentId,
  getProjectsByAdvisorId,
  getProjectsByStatus,
  addStudentsToProject,
  addUserToProject,
};
