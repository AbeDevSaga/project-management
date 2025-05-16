const mongoose = require("mongoose");
const Project = require("../models/project");
const User = require("../models/user");
const { projects } = require("./constant");

const seedProjects = async () => {
  try {
    await Project.deleteMany();
  } catch (error) {
    console.log(error);
  }
};
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
