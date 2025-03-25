const mongoose = require("mongoose");
const User = require("../models/user");
const Department = require("../models/department");
const { departmentNames } = require("./constant");

const seedDepartments = async () => {
  try {
    // Clear existing departments
    await Department.deleteMany({});

    // Find users with the role of "departmentHead" and "advisor"
    const departmentHeads = await User.find({ role: "departmentHead" });
    const advisors = await User.find({ role: "advisor" });

    // If there aren't enough department heads, log an error
    if (departmentHeads.length === 0) {
      console.log("No department heads found in the system.");
      return;
    }

    // Ensure we only create as many departments as there are department heads
    const departmentsToCreate = departmentNames.slice(
      0,
      departmentHeads.length
    );

    // Create departments with heads
    const departmentsData = departmentsToCreate.map((name, index) => ({
      name,
      head: departmentHeads[index]._id,
    }));

    // Insert departments into the database
    const departments = await Department.insertMany(departmentsData);
    console.log(`${departments.length} departments seeded successfully`);

    // Assign each department to its respective head
    for (let i = 0; i < departments.length; i++) {
      await User.findByIdAndUpdate(departments[i].head, {
        $set: { department: departments[i]._id },
      });
    }

    console.log("Department heads have been assigned to their departments.");

    // Now assign advisors to departments
    if (advisors.length > 0) {
      const advisorsPerDept = Math.ceil(advisors.length / departments.length);

      // Loop through each department and assign advisors
      for (let i = 0; i < departments.length; i++) {
        // Slice the advisors array to assign a subset to the current department
        const assignedAdvisors = advisors.slice(i * advisorsPerDept, (i + 1) * advisorsPerDept);

        // Update the department to include the assigned advisors
        await Department.findByIdAndUpdate(departments[i]._id, {
          $push: { advisors: { $each: assignedAdvisors.map(advisor => advisor._id) } },
        });

        // Update the advisors to include the department reference
        for (let advisor of assignedAdvisors) {
          await User.findByIdAndUpdate(advisor._id, {
            $set: { department: departments[i]._id },
          });
        }
      }

      console.log("Advisors have been assigned to their respective departments.");
    } else {
      console.log("No advisors found in the system.");
    }
  } catch (error) {
    console.error("Error seeding departments:", error);
  }
};

module.exports = seedDepartments;
