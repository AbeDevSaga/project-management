const Project = require("../models/project");
const User = require("../models/user");

const populateData = async () => {
  try {
    // Fetch all projects and populate their related students and advisors
    const projects = await Project.find().populate('students').populate('advisor');
    
    // Iterate through each project to populate user data
    for (let project of projects) {
      // Populate students within the project
      const populatedStudents = await User.find({ '_id': { $in: project.students } }).populate('project').populate('advisor');
      
      // Set the project data in each student record
      for (let student of populatedStudents) {
        student.project = project._id;  // Assign this project to the student
        student.department = project.department;  // Assign this project department to the student
        student.advisor = project.advisor;  // Assign the advisor's ID to the student
        await student.save();
      }
      
      // Populate advisor within the project
      const populatedAdvisor = await User.findById(project.advisor).populate('project').populate('advisor');
      
      if (populatedAdvisor) {
        populatedAdvisor.project = project._id; // Assign the project to the advisor
        await populatedAdvisor.save();
      }
    }

    console.log("Data populated successfully");

  } catch (err) {
    console.error("Error populating data:", err);
  }
};

module.exports = populateData;
