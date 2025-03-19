const User = require("../models/user"); 
const bcrypt = require("bcrypt");
const {adminUser} = require("./constants");

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    adminUser.password = await bcrypt.hash(adminUser.password, salt);

    const newAdmin = new User(adminUser);
    await newAdmin.save();

    console.log("Admin user created successfully:", newAdmin);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } 
};

module.exports = seedAdmin;