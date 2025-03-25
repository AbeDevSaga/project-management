const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });
    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Access denied" });
  next();
};

const isAdvisor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "advisor") {
      return res
        .status(403)
        .json({ error: "Access denied, only Advisor are allowed" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const isDeptHead = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || user.role !== "departmentHead") {
        return res
          .status(403)
          .json({ error: "Access denied, only Department Head are allowed" });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  };

module.exports = {
  verifyToken,
  isAdmin,
  isAdvisor,
  isDeptHead,
};