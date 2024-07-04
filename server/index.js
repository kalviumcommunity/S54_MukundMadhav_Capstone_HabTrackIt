const express = require("express");
const cors = require("cors");
const connectedToDB = require("./config/db.js");
const habitRouter = require("./routes/habitRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const admin = require("firebase-admin");
const { serviceAccount } = require("./config/serviceAccountKey.js");
const cron = require("node-cron");
const { sendBroadcastNotification } = require("./cron/cronJob.js");
const habitModel = require("./models/habitModel.js");
const PORT = process.env.PORT || 3000;

const app = express();
const corsConfig = {
  origin: ["http://localhost:5173","http://localhost:5174", "https://habtrackit.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  optionsSuccessStatus: 204,
};
app.options("*", cors(corsConfig));
app.use(cors(corsConfig));
app.use(express.json());

// For Using all the routes
app.use("/", habitRouter);
app.use("/", userRouter);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Defined the Home Route
app.get("/", (req, res) => {
  res.json({
    "Project Name": "HabTrackIt",
    message: "Welcome to HabTrackIt's Server!",
    description:
      "HabTrackIt helps the user to track his/her habits which he/she wants to do daily or wants to break.",
    contact: { email: "mukundmadhav054@gmail.com", github: "mukundmadhav054" },
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
  next();
});

// For connecting and disconnecting from the server
const startServer = async () => {
  try {
    db = await connectedToDB();
    process.on("SIGINT", async () => {
      console.log("Received SIGINT. Shutting down gracefully...");
      await db.close();
      process.exit(0);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();

// For sending daily reminder notifications to all users
cron.schedule(
  "0 18 * * *",
  async () => {
    await sendBroadcastNotification();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

// Cron Job for Resetting the Daily Status of Habits
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily habit reset");
  await habitModel.resetDailyStatus();
});

// Listening to the server at the PORT
app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
