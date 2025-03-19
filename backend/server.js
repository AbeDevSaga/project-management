const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db_config");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "*", 
    credentials: true,  
  })
);
connectDB();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/org", require("./routes/orgRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to the Project Management System!</h1><p>Use the /api/auth/register and /api/auth/login routes to register and login users.</p>"
  );
});

app.listen(PORT, () =>
  console.log(`Authentication service running on port ${PORT}`)
);