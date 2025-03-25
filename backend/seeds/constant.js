const { faker } = require("@faker-js/faker");
const axios = require('axios');
const bcrypt = require("bcryptjs");

const getRandomDate = () => {
  const start = new Date(2022, 0, 1); // Start date (January 1, 2022)
  const end = new Date(); // End date (current date)
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const generateFakeUser = async () => {
  const avatarUrl = faker.image.avatar(); // Generates a random avatar URL
  let profileImageBase64 = '';

  try {
    // Fetch the image from the URL
    const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
    // Convert the image to Base64
    profileImageBase64 = Buffer.from(response.data, 'binary').toString('base64');
  } catch (error) {
    console.error('Error fetching or converting image:', error);
  }
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: hashedPassword,
    profileImage: `data:image/jpeg;base64,${profileImageBase64}`,
    phone: faker.phone.number(),
    created_at: getRandomDate(),
    role: "departmentHead",
    // role: faker.helpers.arrayElement([
    //   "student",
    //   "advisor",
    //   "departmentHead",
    // ]),
  };
};

const adminUser = {
  username: "admin",
  email: "admin@gmail.com",
  password: "admin123",
  phone: "+251915433616",
  role: "admin",
  profileImage: "",
};

const projects = [
  {
    title: "AI-Based Traffic Monitoring System",
    description: "A system utilizing AI to monitor and manage urban traffic congestion in real-time."
  },
  {
    title: "Smart Waste Management System",
    description: "An IoT-based solution to optimize waste collection and disposal in university campuses."
  },
  {
    title: "Blockchain Voting System",
    description: "A secure and transparent voting system using blockchain technology for student elections."
  },
  {
    title: "E-Library Management System",
    description: "A digital library system to facilitate access to academic resources and research papers."
  },
  {
    title: "University Event Management App",
    description: "A mobile and web application for scheduling and managing university events efficiently."
  },
  {
    title: "AI-Powered Healthcare Diagnostic Tool",
    description: "An AI-based tool to assist doctors in diagnosing diseases based on medical images and patient data."
  },
  {
    title: "Smart Campus Parking System",
    description: "A system that helps students and staff find available parking spaces on campus in real-time."
  },
  {
    title: "Online Marketplace for Students",
    description: "A platform for students to buy and sell second-hand books, electronics, and other items."
  },
  {
    title: "Virtual Classroom Management System",
    description: "A system that allows teachers to conduct online classes and manage student interactions and assignments."
  },
  {
    title: "Campus Food Delivery App",
    description: "An app to facilitate the delivery of food from campus cafeterias to students and staff."
  }
];


const departmentNames = [
  "Accounting",
  "Architecture",
  "Biology",
  "Chemistry",
  "Civil Engineering",
  "Computer Science",
  "Electrical Engineering",
  "Environmental Science",
  "Finance",
  "Geography",
  "Geology",
  "Graphic Design",
  "History",
  "Information Technology",
  "Law",
  "Linguistics",
  "Mathematics",
  "Mechanical Engineering",
  "Philosophy",
  "Physics",
];
module.exports = { adminUser, projects, departmentNames, generateFakeUser };