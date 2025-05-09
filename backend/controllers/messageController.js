const Message = require("../models/message");
const Project = require("../models/project");
const Notification = require("../models/notification");

const fs = require("fs");
const path = require("path");

const fileDir = path.join(__dirname, "..", "Uploads", "ChatFiles");
if (!fs.existsSync(fileDir)) {
  fs.mkdirSync(fileDir, { recursive: true });
}
// Send a message to a project (broadcast to all members)
const sendMessage = async (req, res) => {
  console.log("Sending message...");
  try {
    const { content, type, file } = req.body.message;
    const senderId = req.user.id;
    const projectId = req.body.message.project;

    console.log("Request data:", {
      content,
      type,
      senderId,
      projectId,
      file,
    });
    // Validate input
    if (!projectId || (!content && !file)) {
      return res
        .status(400)
        .json({ message: "Project ID and content are required" });
    }

    // Check if sender is part of the project
    const project = await Project.findById(projectId)
      .populate("students advisor")
      .exec();

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Verify sender is either a student or advisor in the project
    const isStudent = project.students.some((student) =>
      student._id.equals(senderId)
    );
    const isAdvisor = project.advisor && project.advisor._id.equals(senderId);

    if (!isStudent && !isAdvisor) {
      return res
        .status(403)
        .json({ message: "You are not a member of this project" });
    }

    let messageData = {
      project: projectId,
      sender: senderId,
      content: content || "",
      type: type || (fileName ? "file" : "text"),
    };

    // Create the message
    if (type === "file" && file) {
      const fileDir = path.join(__dirname, "../Uploads/ChatFiles");
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }

    

      
      const originalFilename = file.originalname;
      const filePath = path.join('ChatFiles', originalFilename);
      const fullPath = path.join(fileDir, originalFilename);

      // Move the file from temp location to permanent storage
      //fs.renameSync(file.tempPath, fullPath);

      fs.renameSync(file, fullPath);
      messageData.file = filePath;
    } 

    // Save the message
    const message = new Message(messageData);
    await message.save();

    // Get all project members (students + advisor)
    const members = [
      ...project.students.map((student) => student._id),
      ...(project.advisor ? [project.advisor._id] : []),
    ].filter((memberId) => !memberId.equals(senderId)); // Exclude sender

    // Create notifications for all members
    const notifications = members.map((memberId) => ({
      recipient: memberId,
      sender: senderId,
      type: "Message",
      projectId: projectId,
      message: `New message in project ${project.title}`,
    }));

    await Notification.insertMany(notifications);

    // Populate sender details before returning
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "username email profileImage")
      .exec();

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// const sendMessage = async (req, res) => {
//   console.log("Sending message...");
//   try {
//     // Extract data from request
//     const { content, type, file } = req.body.message;
//     const senderId = req.user.id;
//     const projectId = req.body.message.project;

//     console.log("Request data:", {
//       content,
//       type,
//       senderId,
//       projectId,
//       file,
//     });

//     // Validate input
//     if (!projectId || (!content && !file)) {
//       return res.status(400).json({ 
//         message: "Project ID and content or file are required" 
//       });
//     }

//     // Check if sender is part of the project
//     const project = await Project.findById(projectId)
//       .populate("students advisor")
//       .exec();

//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     // Verify sender is either a student or advisor in the project
//     const isStudent = project.students.some((student) =>
//       student._id.equals(senderId)
//     );
//     const isAdvisor = project.advisor && project.advisor._id.equals(senderId);

//     if (!isStudent && !isAdvisor) {
//       return res.status(403).json({ 
//         message: "You are not a member of this project" 
//       });
//     }

//     // Prepare message data
//     let messageData = {
//       project: projectId,
//       sender: senderId,
//       content: content || (file ? path.basename(file) : ""),
//       type: type || (file ? "file" : "text"),
//       ...(file && { file: path.join('ChatFiles', file) })
//     };

//     // Save the message
//     const message = new Message(messageData);
//     await message.save();

//     // Get all project members (students + advisor)
//     const members = [
//       ...project.students.map((student) => student._id),
//       ...(project.advisor ? [project.advisor._id] : []),
//     ].filter((memberId) => !memberId.equals(senderId));

//     // Create notifications for all members
//     const notifications = members.map((memberId) => ({
//       recipient: memberId,
//       sender: senderId,
//       type: "Message",
//       projectId: projectId,
//       message: `New message in project ${project.title}`,
//     }));

//     await Notification.insertMany(notifications);

//     // Populate sender details before returning
//     const populatedMessage = await Message.findById(message._id)
//       .populate("sender", "username email profileImage")
//       .exec();

//     res.status(201).json(populatedMessage);
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({
//       message: "Failed to send message",
//       error: error.message,
//     });
//   }
// };

// Get all messages for a project
const getProjectMessages = async (req, res) => {
  console.log("Getting project messages...");
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if user is part of the project
    const project = await Project.findById(projectId)
      .populate("students advisor")
      .exec();

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Verify user is either a student or advisor in the project
    const isStudent = project.students.some((student) =>
      student._id.equals(userId)
    );
    const isAdvisor = project.advisor && project.advisor._id.equals(userId);

    if (!isStudent && !isAdvisor) {
      return res
        .status(403)
        .json({ message: "You are not a member of this project" });
    }

    // Get messages sorted by timestamp (newest first)
    const messages = await Message.find({ project: projectId })
      .populate("sender", "username email profileImage")
      .sort({ timestamp: -1 })
      .exec();

    // Mark user's notifications for this project as read
    await Notification.updateMany(
      {
        recipient: userId,
        projectId: projectId,
        type: "message",
      },
      { $set: { read: true } }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({
      message: "Failed to get messages",
      error: error.message,
    });
  }
};

// Get a single message by ID
const getMessageById = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId)
      .populate("sender", "username email profileImage")
      .populate({
        path: "project",
        populate: [
          { path: "students", select: "username email" },
          { path: "advisor", select: "username email" },
        ],
      })
      .exec();

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Verify user is part of the project
    const project = message.project;
    const isStudent = project.students.some((student) =>
      student._id.equals(userId)
    );
    const isAdvisor = project.advisor && project.advisor._id.equals(userId);

    if (!isStudent && !isAdvisor) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this message" });
    }

    res.status(200).json({
      message: "Message retrieved successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error getting message:", error);
    res.status(500).json({
      message: "Failed to get message",
      error: error.message,
    });
  }
};

// Delete a message (only by sender or admin)
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only allow deletion by sender or admin
    if (!message.sender.equals(userId) && userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages" });
    }

    await Message.deleteOne({ _id: messageId });

    // Also delete any notifications related to this message
    await Notification.deleteMany({ referenceId: messageId, type: "message" });

    res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      message: "Failed to delete message",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getProjectMessages,
  getMessageById,
  deleteMessage,
};
