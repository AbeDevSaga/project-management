const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Department = require("../models/department");

const login = async (req, res) => {
  console.log("login recieved", req.body)
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("department");
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid user name or password" });

    
    const tokenPayload = {
      id: user._id,
      role: user.role
    };

     if (user.department && user.role !== 'admin') {
      tokenPayload.department = user.department._id;
    }

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "Login failed", details: error });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Registration failed", details: error });
  }
};

module.exports = {
  login,
  register,
};