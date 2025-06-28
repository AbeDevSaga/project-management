const Project = require("../models/project");
const Department = require("../models/department");

const populateData = async () => {
  try {

    // 1. Ensure each department's projects array contains all its projects
    const departments = await Department.find().populate('projects');
    
    // Update each department's projects array if needed
    for (const dept of departments) {
      // Find all projects that reference this department
      const deptProjects = await Project.find({ department: dept._id });
      
      // Get just the project IDs
      const projectIds = deptProjects.map(p => p._id);
      
      // Update if the department's projects array doesn't match
      if (dept.projects.length !== projectIds.length || 
          !projectIds.every(id => dept.projects.some(p => p.equals(id)))) {
        
        await Department.findByIdAndUpdate(
          dept._id,
          { $set: { projects: projectIds } },
          { new: true }
        );
        console.log(`Updated projects for department ${dept.name}`);
      }
    }

    console.log("Data population and department-project synchronization complete");

  } catch (err) {
    console.error("Error populating data:", err);
    throw err;
  }
};

module.exports = populateData;