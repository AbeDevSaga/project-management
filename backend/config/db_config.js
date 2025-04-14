const mongoose = require("mongoose");
const dotenv = require('dotenv');
const seedAdmin = require('../seeds/seedAdmin');
const seedUsers = require('../seeds/seedUsers');
const seedProjects = require('../seeds/seedProjects');
const populateData = require('../seeds/populateData');
const populateChatGroups = require('../seeds/populateChat');
const seedDepartments = require('../seeds/seedDepartment');

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB')

    // register schemas
    require("../models/chat");
    require("../models/department");
    require("../models/feedback");
    require("../models/manual");
    require("../models/message");
    require("../models/project");
    require("../models/proposal");
    require("../models/submission");
    require("../models/task");
    require("../models/notification");
    require("../models/user");

    // seed datas
    // await seedUsers(40);
    // await seedAdmin();
    // await seedProjects(); 
    // await populateData();
    // await seedDepartments();
    // await populateChatGroups();

  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

module.exports = connectDB;