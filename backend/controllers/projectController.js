const Project = require("../models/project");
const File = require("../models/file");
const fs = require("fs");
const { getFileType } = require("./fileController");

// Create a new project
// const createProject = async (req, res) => {
//   console.log("createProject");
//   try {
//     const {
//       title,
//       description,
//       department,
//       projectStatus,
//       tasks,
//       proposals,
//       students,
//       advisor,
//       submissions,
//     } = req.body;

//     const project = new Project({
//       title,
//       description,
//       department,
//       projectStatus,
//       tasks,
//       proposals,
//       students,
//       advisor,
//       submissions,
//     });

//     await project.save();
//     res.status(201).json({ message: "Project created successfully" });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ error: "Project creation failed", details: error.message });
//   }
// };

const createProject = async (req, res) => {
  console.log("createProject");
  try {
    const { title, description, department, students, advisor } = req.body;
    console.log("req.body: ", req.body)
    // Create project
    const project = new Project({
      title,
      description,
      department,
      projectStatus: "in-progress",
      students: students,
      advisor,
    });

    await project.save();

    // Handle proposal file if uploaded
    if (req.file) {
      const file = new File({
        projectId: project._id,
        name: req.file.originalname,
        path: req.file.path,
        property: "description",
        type: getFileType(req.file.mimetype),
        uploadedBy: req.user.id
      });

      await file.save();
      
      // Update project with proposal reference
      project.files.push(file)
      await project.save();
    }

    res.status(201).json({
      message: "Project created successfully",
      project: await Project.findById(project._id).populate('proposal'),
    });
  } catch (error) {
    // Clean up uploaded file if project creation failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({
      error: "Project creation failed",
      details: error.message,
    });
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
      .populate("evaluators")
      .populate("department")
      .populate("files")
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
      .populate("evaluators")
      .populate("evaluations")
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
    console.log("req.params id", req.params);
    const projects = await Project.find({ department: id })
      .populate("students")
      .populate("advisor")
      .populate("department")
      .populate("evaluators")
      .populate("files")
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
      .populate("evaluators")
      .populate("files")
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
    console.log("id ", id);
    
    // Find projects where the user is either the advisor OR an evaluator
    const projects = await Project.find({
      $or: [
        { advisor: id },
        { evaluators: id }
      ]
    })
    .populate("students")
    .populate("advisor")
    .populate("department")
    .populate("evaluators")
    .populate("files")
    .populate({
      path: 'evaluations.evaluator',
      model: 'User'
    });

    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this advisor" });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error getting projects by advisor ID:", error);
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
      .populate("files")
      .populate("evaluators")
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
// Add Advisors to a project
const addEvaluatorsToProject = async (req, res) => {
  console.log("addEvaluatorsToProject");
  try {
    const { id } = req.params;
    const { evaluatorsIds } = req.body;

    // Validate input
    if (!evaluatorsIds || !Array.isArray(evaluatorsIds) || evaluatorsIds.length === 0) {
      return res.status(400).json({ message: "Invalid evaluators IDs provided" });
    }

    // Find the project and update it
    const project = await Project.findByIdAndUpdate(
      id,
      { $addToSet: { evaluators: { $each: evaluatorsIds } } }, // Using $addToSet to avoid duplicates
      { new: true }
    ).populate("evaluators");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Evaluators added to project successfully",
      project,
    });
  } catch (error) {
    console.error("Error adding evaluators to project:", error);
    res.status(500).json({
      message: "Failed to add evaluators to project",
      error: error.message,
    });
  }
};
// Add evaluation to a project
// const addEvaluationToProject = async (req, res) => {
//   console.log("addEvaluationToProject body: ", req.body);
//   try {
//     const { id } = req.params;
//     const {
//       evaluatorId,
//       presentation,
//       knowledgeDomain,
//       knowledgeMethodology,
//       questionConfidence,
//       contentClarity,
//       problemStatement,
//       objectivesSignificance,
//       projectMethodology,
//       useCaseDiagram,
//       sequenceActivityDiagram,
//       classDiagram,
//       persistenceDiagram,
//       comments
//     } = req.body;

//     // Validate required fields
//     if (!evaluatorId) {
//       return res.status(400).json({ message: "Evaluator ID is required" });
//     }

//     // Calculate total marks
//     const totalMarks = 
//       (presentation || 0) +
//       (knowledgeDomain || 0) +
//       (knowledgeMethodology || 0) +
//       (questionConfidence || 0) +
//       (contentClarity || 0) +
//       (problemStatement || 0) +
//       (objectivesSignificance || 0) +
//       (projectMethodology || 0) +
//       (useCaseDiagram || 0) +
//       (sequenceActivityDiagram || 0) +
//       (classDiagram || 0) +
//       (persistenceDiagram || 0);

//     // Create evaluation object
//     const evaluation = {
//       evaluator: evaluatorId,
//       date: new Date(),
//       presentation,
//       knowledgeDomain,
//       knowledgeMethodology,
//       questionConfidence,
//       contentClarity,
//       problemStatement,
//       objectivesSignificance,
//       projectMethodology,
//       useCaseDiagram,
//       sequenceActivityDiagram,
//       classDiagram,
//       persistenceDiagram,
//       totalMarks,
//       comments
//     };

//     // Find the project and add the evaluation
//     const project = await Project.findByIdAndUpdate(
//       id,
//       { $push: { evaluations: evaluation } },
//       { new: true }
//     )
//     .populate("evaluations.evaluator")

//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     res.status(200).json({
//       message: "Evaluation added to project successfully",
//       project,
//     });
//   } catch (error) {
//     console.error("Error adding evaluation to project:", error);
//     res.status(500).json({
//       message: "Failed to add evaluation to project",
//       error: error.message,
//     });
//   }
// };
const addEvaluationToProject = async (req, res) => {
  console.log("addEvaluationToProject body: ", req.body);
  try {
    const { id } = req.params;
    
    // Handle both nested evaluationData and flat body formats
    const evaluationInput = req.body.evaluationData || req.body;
    const projectId = evaluationInput.projectId || id;
    
    // Destructure with fallbacks for both formats
    const {
      evaluatorId = evaluationInput.evaluatorId,
      form = {},
      comments = evaluationInput.comments || '',
      date = evaluationInput.date || new Date()
    } = evaluationInput;

    // Extract evaluation criteria from form or root
    const evaluationCriteria = {
      presentation: form.presentation || evaluationInput.presentation || 0,
      knowledgeDomain: form.knowledgeDomain || evaluationInput.knowledgeDomain || 0,
      knowledgeMethodology: form.knowledgeMethodology || evaluationInput.knowledgeMethodology || 0,
      questionConfidence: form.questionConfidence || evaluationInput.questionConfidence || 0,
      contentClarity: form.contentClarity || evaluationInput.contentClarity || 0,
      problemStatement: form.problemStatement || evaluationInput.problemStatement || 0,
      objectivesSignificance: form.objectivesSignificance || evaluationInput.objectivesSignificance || 0,
      projectMethodology: form.projectMethodology || evaluationInput.projectMethodology || 0,
      useCaseDiagram: form.useCaseDiagram || evaluationInput.useCaseDiagram || 0,
      sequenceActivityDiagram: form.sequenceActivityDiagram || evaluationInput.sequenceActivityDiagram || 0,
      classDiagram: form.classDiagram || evaluationInput.classDiagram || 0,
      persistenceDiagram: form.persistenceDiagram || evaluationInput.persistenceDiagram || 0,
    };

    // Validate required fields
    if (!evaluatorId) {
      return res.status(400).json({ message: "Evaluator ID is required" });
    }

    // Calculate total marks
    const totalMarks = Object.values(evaluationCriteria).reduce(
      (sum, value) => sum + (value || 0),
      0
    );

    // Create evaluation object
    const evaluation = {
      evaluator: evaluatorId,
      date: date instanceof Date ? date : new Date(date),
      ...evaluationCriteria,
      totalMarks,
      comments,
      status: "completed" // Default status
    };

    // Find the project and add the evaluation
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $push: { evaluations: evaluation } },
      { new: true }
    )
    .populate("evaluations.evaluator")
    .populate("advisor")
    .populate("students");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Evaluation added to project successfully",
      project,
    });
  } catch (error) {
    console.error("Error adding evaluation to project:", error);
    res.status(500).json({
      message: "Failed to add evaluation to project",
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
  addEvaluatorsToProject,
  addEvaluationToProject,
  addUserToProject,
};
