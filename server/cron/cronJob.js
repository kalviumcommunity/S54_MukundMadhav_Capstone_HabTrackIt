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
    const response = await admin.messaging().sendEachForMulticast({
      notification: {
        title: "Reminder to update your Habits",
        body: "Don't forget to update your habits today!",
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/habtrackit.appspot.com/o/images%2FHabTrackIt%20Logo.png38523589-ac78-4ba0-b983-94d3906aacca?alt=media&token=af7ebabb-d39f-4abd-94f9-8960fcc5ca18",
      },
      data: {
        url: "https://habtrackit.vercel.app/",
      },
      tokens: allTokens,
    });

    console.log("Successfully sent broadcast message:", response);
  } catch (error) {
    console.error("Error sending broadcast notification:", error);
  }
};

module.exports = { sendBroadcastNotification };
