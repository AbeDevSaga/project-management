const mongoose = require("mongoose");
const messageSchema = require("./message");
const Project = require("./project");

const chatGroupSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    unique: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

chatGroupSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

chatGroupSchema.pre("save", async function (next) {
  try {
    // Only run this for new documents or when project reference changes
    if (this.isNew || this.isModified("project")) {
      const project = await Project.findById(this.project).populate(
        "students advisor"
      );

      if (project) {
        // Get current members as strings for comparison
        const currentMemberIds = this.members.map((m) => m.toString());

        // Combine students and advisor
        const newMembers = [...project.students];
        if (project.advisor) {
          newMembers.push(project.advisor);
        }

        // Filter out duplicates
        const uniqueNewMembers = newMembers.filter(
          (member) => !currentMemberIds.includes(member._id.toString())
        );

        // Add only new unique members
        this.members.push(...uniqueNewMembers);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const ChatGroup = mongoose.model("ChatGroup", chatGroupSchema);
module.exports = ChatGroup;
