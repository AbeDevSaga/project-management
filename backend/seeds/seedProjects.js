const mongoose = require("mongoose");
const Project = require("../models/project");
const Department = require("../models/department");
const User = require("../models/user");
const { projects } = require("./constant");

const seedProjects = async () => {
  try {
    await Project.deleteMany();
    console.log("Old projects removed");

    // Get all departments
    const departments = await Department.find();
    if (departments.length === 0) {
      throw new Error("No departments found in database");
    }

    const projectData = [];

    // Process each department separately
    for (const department of departments) {
      // Get users from this department
      const departmentStudents = await User.find({ 
        role: "student", 
        department: department._id 
      });
      
      const departmentAdvisors = await User.find({ 
        role: "advisor", 
        department: department._id 
      });
      
      const departmentEvaluators = await User.find({ 
        role: "evaluator", 
        department: department._id 
      });

      if (departmentStudents.length < 1 || departmentAdvisors.length < 1) {
        console.log(`Skipping department ${department.name} - not enough students or advisors`);
        continue;
      }

      // Calculate number of projects for this department (3-4 students per project)
      const projectsPerDepartment = Math.ceil(departmentStudents.length / 4);
      const projectsForDept = projects.slice(0, projectsPerDepartment);

      // Create projects for this department
      for (let i = 0; i < projectsForDept.length; i++) {
        // Select 3-4 random students (ensure no student is in multiple projects)
        const numStudents = Math.min(4, departmentStudents.length);
        const selectedStudents = departmentStudents
          .splice(0, numStudents)
          .map(student => student._id);

        // Select 1 random advisor
        const selectedAdvisor = departmentAdvisors[
          Math.floor(Math.random() * departmentAdvisors.length)
        ]._id;

        // Select 2 random evaluators
        const selectedEvaluators = [];
        if (departmentEvaluators.length >= 2) {
          const shuffledEvaluators = [...departmentEvaluators].sort(() => 0.5 - Math.random());
          selectedEvaluators.push(
            shuffledEvaluators[0]._id,
            shuffledEvaluators[1]._id
          );
        }

        // Create project data
        projectData.push({
          title: projectsForDept[i].title,
          description: projectsForDept[i].description,
          department: department._id,
          projectStatus: 'in-progress',
          tasks: [],
          proposals: [],
          files: [],
          students: selectedStudents,
          advisor: selectedAdvisor,
          evaluators: selectedEvaluators,
          submissions: [],
          evaluations: [],
          isApproved: false,
          isRejected: false,
          createdAt: new Date()
        });
      }
    }

    // Insert all projects
    const createdProjects = await Project.insertMany(projectData);
    console.log(`${createdProjects.length} projects seeded successfully`);

    // Update user records to reference their projects
    for (const project of createdProjects) {
      // Update students
      // await User.updateMany(
      //   { _id: { $in: project.students } },
      //   { $set: { project: project._id } }
      // );

      // Update advisor
      // await User.updateOne(
      //   { _id: project.advisor },
      //   { $addToSet: { projects: project._id } }
      // );

      // Update evaluators
      // await User.updateMany(
      //   { _id: { $in: project.evaluators } },
      //   { $addToSet: { projects: project._id } }
      // );

      // Update department
      await Department.updateOne(
        { _id: project.department },
        { $addToSet: { projects: project._id } }
      );
    }

    console.log("User and department references updated");

  } catch (err) {
    console.error("Error seeding projects:", err);
  }
};

// const seedProjects = async () => {
//   try {
//     await Project.deleteMany();
//   } catch (error) {
//     console.log(error);
//   }
// };

// const seedProjects = async () => {
//   try {
//     await Project.deleteMany();
//     console.log("Old projects removed");

//     const students = await User.find({ role: "student" });
//     const advisors = await User.find({ role: "advisor" });

//     if (students.length < 1 || advisors.length < 1) {
//       throw new Error("Not enough students or advisors in the database.");
//     }

//     // Calculate number of projects based on available students
//     const numberOfProjects = Math.ceil(students.length / 4); // 4 students per project, round up

//     const projectData = [];

//     // For each project, randomly assign up to 4 students and 1 advisor
//     for (let i = 0; i < numberOfProjects; i++) {
//       // Randomly select 4 students for each project (or fewer if it's the last project)
//       const numStudents = i === numberOfProjects - 1 && students.length % 4 !== 0 ? students.length % 4 : 4;
//       const selectedStudents = [];

//       while (selectedStudents.length < numStudents) {
//         const randomStudent = students[Math.floor(Math.random() * students.length)];
//         if (!selectedStudents.includes(randomStudent._id)) {
//           selectedStudents.push(randomStudent._id);
//         }
//       }

//       // Remove the selected students from the pool (to avoid reassigning)
//       selectedStudents.forEach(studentId => {
//         const studentIndex = students.findIndex(student => student._id.toString() === studentId.toString());
//         students.splice(studentIndex, 1);
//       });

//       // Randomly select 1 advisor for each project
//       const selectedAdvisor = advisors[Math.floor(Math.random() * advisors.length)];

//       // Remove the selected advisor from the pool (to avoid reassigning)
//       const advisorIndex = advisors.findIndex(advisor => advisor._id.toString() === selectedAdvisor._id.toString());
//       advisors.splice(advisorIndex, 1);

//       // Create the project data
//       projectData.push({
//         title: projects[i % projects.length].title, // Loop through project titles if there are more projects than titles
//         description: projects[i % projects.length].description,
//         department: null, // Assign department later if needed
//         projectStatus: 'in-progress',
//         tasks: [],
//         proposals: [],
//         submissions: [],
//         students: selectedStudents,  // Assigned students
//         advisor: selectedAdvisor._id, // Assigned advisor
//         department: selectedAdvisor.department, // Assigned department
//       });
//     }

//     // Insert projects with the assigned students and advisors
//     await Project.insertMany(projectData);
//     console.log("Projects seeded successfully");

//   } catch (err) {
//     console.error(err);
//   }
// };

module.exports = seedProjects;
