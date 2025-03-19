//The Department model stores information about each department in the system.
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Department head (DepartmentHead role)
    advisors: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  // Advisors in the department
    ],
    students: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  // Students in the department
    ]
  });
  
  const Department = mongoose.model('Department', departmentSchema);
  module.exports = Department;
  