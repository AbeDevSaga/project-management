const Notification = require("../models/notification"); 

const seedNotification = async () => {
  try {
    await Notification.deleteMany();
  } catch (error) {
    console.log(error);
  }
};
module.exports = seedNotification;