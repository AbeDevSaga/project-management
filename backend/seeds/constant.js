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
    role: faker.helpers.arrayElement([
      "student",
      "advisor",
      "departmentHead",
    ]),
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

module.exports = { adminUser, generateFakeUser };