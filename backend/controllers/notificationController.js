const Notification = require("../models/notification");
const User = require("../models/user");

// Create a notification (though you mentioned you create them in other controllers)
const createNotification = async (req, res) => {
  try {
    const { recipients, type, message, projectId, sender } = req.body;

    // Validate recipients exist
    const users = await User.find({ _id: { $in: recipients } });
    if (users.length !== recipients.length) {
      return res.status(400).json({ message: "One or more recipients not found" });
    }

    const notification = new Notification({
      recipients,
      type,
      message,
      projectId: projectId || null,
      sender: sender || null
    });

    await notification.save();

    res.status(201).json({
      message: "Notification created successfully",
      notification
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to create notification",
      details: error.message
    });
  }
};

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const notifications = await Notification.find({ 
      recipients: userId 
    })
    .populate('recipients', 'name email')
    .populate('sender', 'name email')
    .populate('projectId', 'title')
    .sort({ timestamp: -1 });

    res.status(200).json({
      notifications
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to get notifications",
      details: error.message
    });
  }
};

// Update notification status (mark as read)
const updateNotificationStatus = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { status } = req.body;

    if (!['read', 'unread'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { status },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification status updated successfully",
      notification
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to update notification status",
      details: error.message
    });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to delete notification",
      details: error.message
    });
  }
};

// Mark all notifications as read for a user
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.params.userId;

    const result = await Notification.updateMany(
      { recipients: userId, status: 'unread' },
      { $set: { status: 'read' } }
    );

    res.status(200).json({
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to mark notifications as read",
      details: error.message
    });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  updateNotificationStatus,
  deleteNotification,
  markAllAsRead
};