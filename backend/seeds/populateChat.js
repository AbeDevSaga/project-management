const Project = require("../models/project");
const User = require("../models/user");
const ChatGroup = require("../models/chat");
const Message = require("../models/message");

const populateChatGroups = async () => {
  try {
    // Fetch all projects with their students and advisors
    const projects = await Project.find()
      .populate('students')
      .populate('advisor');

    for (let project of projects) {
      // Check if chat group already exists for this project
      let chatGroup = await ChatGroup.findOne({ project: project._id });

      if (!chatGroup) {
        // Create new chat group if it doesn't exist
        chatGroup = new ChatGroup({
          project: project._id,
          members: [
            ...project.students.map(s => s._id),
            ...(project.advisor ? [project.advisor._id] : [])
          ],
          createdAt: new Date()
        });

        await chatGroup.save();
        console.log(`Created chat group for project: ${project.title}`);
      }

      // Ensure all current project members are in the chat group
      const currentMembers = new Set(chatGroup.members.map(m => m.toString()));
      const allProjectMembers = [
        ...project.students.map(s => s._id.toString()),
        ...(project.advisor ? [project.advisor._id.toString()] : [])
      ];

      // Add any missing members
      const newMembers = allProjectMembers.filter(
        memberId => !currentMembers.has(memberId)
      );

      if (newMembers.length > 0) {
        chatGroup.members.push(...newMembers);
        await chatGroup.save();
        console.log(`Added ${newMembers.length} new members to chat group for project: ${project.title}`);
      }

      // Optionally create welcome messages
      if (chatGroup.messages.length === 0) {
        const welcomeMessage = new Message({
          content: `Welcome to the project "${project.title}" chat group!`,
          sender: project.advisor ? project.advisor._id : project.students[0]._id,
          chatGroup: chatGroup._id
        });

        await welcomeMessage.save();
        chatGroup.messages.push(welcomeMessage._id);
        await chatGroup.save();
      }
    }

    console.log("Chat group population completed successfully");
  } catch (err) {
    console.error("Error populating chat groups:", err);
    throw err; // Re-throw to handle in calling function
  }
};

module.exports = populateChatGroups;