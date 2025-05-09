const Schedule = require("../models/schedule");
const Project = require("../models/project");

const createSchedule = async (req, res) => {
  console.log("createSchedule");
  try {
    const { title, project, description, type, link, place } = req.body;
    const createdBy = req.user.id;

    // Validate required fields
    if (!title || !project || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate online meeting has a link
    if (title === "online" && !link) {
      return res.status(400).json({ error: "Online meetings require a link" });
    }

    // Check if project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ error: "Project not found" });
    }

    const schedule = new Schedule({
      title,
      project,
      description,
      type,
      link,
      createdBy,
      place,
    });

    await schedule.save();

    // Add schedule to project
    await Project.findByIdAndUpdate(project, {
      $push: { schedules: schedule._id },
    });

    res.status(201).json({
      message: "Schedule created successfully",
      schedule: {
        id: schedule._id,
        title: schedule.title,
        project: schedule.project,
        description: schedule.description,
        type: schedule.type,
        link: schedule.link,
        createdBy: schedule.createdBy,
      },
    });
  } catch (error) {
    console.error('Schedule creation error:', error);
    res.status(400).json({
      error: "Schedule creation failed",
      details: error.message,
    });
  }
};

const updateSchedule = async (req, res) => {
  console.log("updateSchedule");
  try {
    const { id } = req.params;
    const { title, description, type, link } = req.body;
    
    // Find the existing schedule
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Check if the user is the creator or has admin privileges
    if (schedule.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to update this schedule" });
    }

    // Prepare updates
    const updates = {
      title,
      description,
      type,
      link,
      updatedAt: Date.now()
    };

    // Validate online meeting has a link
    if (updates.title === "online" && !updates.link) {
      return res.status(400).json({ error: "Online meetings require a link" });
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("project createdBy");

    res.status(200).json({
      message: "Schedule updated successfully",
      schedule: updatedSchedule,
    });
  } catch (error) {
    console.error('Schedule update error:', error);
    res.status(500).json({ message: "Failed to update schedule", error });
  }
};

const deleteSchedule = async (req, res) => {
  console.log("deleteSchedule");
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Only allow deletion by creator or admin
    if (schedule.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete this schedule" });
    }

    // Remove schedule from its project's schedules array
    await Project.findByIdAndUpdate(schedule.project, {
      $pull: { schedules: schedule._id },
    });

    await Schedule.findByIdAndDelete(id);
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error('Schedule deletion error:', error);
    res.status(500).json({ message: "Failed to delete schedule", error });
  }
};

const getAllSchedules = async (req, res) => {
  console.log("getAllSchedules");
  try {
    const schedules = await Schedule.find()
      .populate("project createdBy")
      .sort({ createdAt: -1 });
    res.status(200).json(schedules);
  } catch (error) {
    console.error('Get all schedules error:', error);
    res.status(500).json({ message: "Failed to get schedules", error });
  }
};

const getScheduleById = async (req, res) => {
  console.log("getScheduleById");
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id).populate("project createdBy");
    
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    
    res.status(200).json(schedule);
  } catch (error) {
    console.error('Get schedule by ID error:', error);
    res.status(500).json({ message: "Failed to get schedule", error });
  }
};

const getSchedulesByProject = async (req, res) => {
  console.log("getSchedulesByProject");
  try {
    const { projectId } = req.params;
    const schedules = await Schedule.find({ project: projectId })
      .populate("createdBy")
      .sort({ createdAt: -1 });
    
    res.status(200).json(schedules);
  } catch (error) {
    console.error('Get schedules by project error:', error);
    res.status(500).json({ message: "Failed to get project schedules", error });
  }
};

const getSchedulesByUser = async (req, res) => {
  console.log("getSchedulesByUser");
  try {
    const { userId } = req.params;
    const schedules = await Schedule.find({ createdBy: userId })
      .populate("project createdBy")
      .sort({ createdAt: -1 });
    
    res.status(200).json(schedules);
  } catch (error) {
    console.error('Get schedules by user error:', error);
    res.status(500).json({ message: "Failed to get user schedules", error });
  }
};

const getUpcomingSchedules = async (req, res) => {
  console.log("getUpcomingSchedules");
  try {
    const currentDate = new Date();
    const schedules = await Schedule.find({
      createdAt: { $gte: currentDate }
    })
      .populate("project createdBy")
      .sort({ createdAt: 1 })
      .limit(10); // Limit to 10 upcoming schedules
    
    res.status(200).json(schedules);
  } catch (error) {
    console.error('Get upcoming schedules error:', error);
    res.status(500).json({ message: "Failed to get upcoming schedules", error });
  }
};

module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAllSchedules,
  getScheduleById,
  getSchedulesByProject,
  getSchedulesByUser,
  getUpcomingSchedules,
};