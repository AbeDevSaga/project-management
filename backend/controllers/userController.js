const User = require("../models/user");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  console.log("createUser");
  const organization = req.organizationId.toString();
  try {
    const { username, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      organization,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Registration failed", details: error.message });
  }
};

const updateUser = async (req, res) => {
  console.log("updateUser");
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      message: "User updated successfully",
      User: updateUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update User", error });
  }
};

const deleteUser = async (req, res) => {
  console.log("deleteUser");
  try {
    const { id } = req.params;
    const deletedUser = await Organization.findByIdAndDelete(id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete User", error });
  }
};

const getAllUsers = async (req, res) => {
  console.log("getAllUsers");
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users", error });
  }
};

const getUserById = async (req, res) => {
  console.log("getUserById");
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get User", error });
  }
};

const getUsersByOrganizationId = async (req, res) => {
  console.log("getUsersByOrganizationId");
  try {
    const { id } = req.params;
    const users = await User.find({ organization: id });
    if (!users) return res.status(404).json({ message: "User not found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get User", error });
  }
};

const getPremiumUsers = async (req, res) => {
  console.log("get premium");
  try {
    const premiumUsers = await User.find({ isPremium: true });
    if (!premiumUsers)
      return res.status(404).json({ message: "Premium Users not found" });
    res.status(200).json(premiumUsers);
  } catch (error) {
    res.status(500).json({ message: "Failed to get Premium Users", error });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUsersByOrganizationId,
  getPremiumUsers,
};