const UserModel = require("../models/userModel");
const admin = require("firebase-admin");

const sendBroadcastNotification = async () => {
  try {
    const users = await UserModel.find({}, "fcmTokens"); // Get all users

    const allTokens = users.reduce((acc, user) => {
      return [...acc, ...user.fcmTokens];
    }, []);

    if (allTokens.length === 0) {
      console.log("No user tokens found for broadcast.");
      return;
    }

    // Send the notification
    const response = await admin.messaging().sendMulticast({
      notification: {
        title: "Reminder to update your Habits",
        body: "Don't forget to update your habits today!",
      },
      tokens: allTokens,
    });

    console.log("Successfully sent broadcast message:", response);
  } catch (error) {
    console.error("Error sending broadcast notification:", error);
  }
};

module.exports = { sendBroadcastNotification };
