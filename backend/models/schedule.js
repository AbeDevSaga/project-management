const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    enum: ["online", "in person"],
    default: "online",
    required: true,
  },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project"},
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ["Zoom", "Google Meet", "Microsoft Teams", "Skype", "Webex", "Other"],
    default: "Zoom",
  },
  link: { type: String }, // Link to the online meeting (if applicable)
  place: {type: String},
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Creator of the schedule
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  date: {type: Date},
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
