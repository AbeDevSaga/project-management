const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db_config");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/dept", require("./routes/deptRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/manual", require("./routes/manualRoutes"));
app.use("/api/notification", require("./routes/notificationRoutes"));
app.use("/api/project", require("./routes/projectRoutes"));
app.use("/api/proposal", require("./routes/proposalRoutes"));
app.use("/api/schedule", require("./routes/scheduleRoutes"));
app.use("/api/submission", require("./routes/submissionRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to the Project Management System!!!!!!"
  );
});

app.listen(PORT, () =>
  console.log(`Authentication service running on port ${PORT}`)
);