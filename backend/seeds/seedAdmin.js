const User = require("../models/user"); 
const bcrypt = require("bcrypt");
const {adminUser} = require("./constant");

const seedAdmin = async () => {
  try {
    await User.deleteOne({email: adminUser.email }); 
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin);
      return;
    }
    adminUser.password = await bcrypt.hash(adminUser.password, 10);

    const newAdmin = new User(adminUser);
    await newAdmin.save();

    console.log("Admin user created successfully:", newAdmin);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } 
};

module.exports = seedAdmin;