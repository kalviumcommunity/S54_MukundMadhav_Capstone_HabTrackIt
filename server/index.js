const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectedToDB = require("./config/db.js");
const habitRouter = require("./routes/habitRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const admin = require("firebase-admin");
const { loadServiceAccount } = require("./config/serviceAccountKey.js");
const cron = require("node-cron");
const { sendBroadcastNotification } = require("./cron/cronJob.js");
const habitModel = require("./models/habitModel.js");
const PORT = process.env.PORT || 3000;

// Crash-loop prevention: log async failures instead of letting them kill
// the process (a single bad request must never page the whole deployment).
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

const app = express();
const corsConfig = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://habtrackit.vercel.app",
  ],
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

// Firebase Admin SDK is optional: push notifications are non-critical.
// A bad/missing service account now disables push instead of crashing boot.
let pushEnabled = false;
try {
  admin.initializeApp({
    credential: admin.credential.cert(loadServiceAccount()),
  });
  pushEnabled = true;
  console.log("Firebase Admin initialized. Push notifications enabled.");
} catch (error) {
  console.error(
    `Firebase Admin NOT initialized — push notifications disabled: ${error.message}`
  );
}

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

// Health check for the hosting platform (Railway) and uptime monitors.
// Returns 200 when HTTP is up; reports DB/push state without failing.
app.get("/healthz", (req, res) => {
  const dbState = mongoose.connection.readyState; // 0=off,1=on,2=connecting,3=disconnecting
  res.status(200).json({
    status: "ok",
    db: dbState === 1 ? "connected" : "degraded",
    push: pushEnabled ? "enabled" : "disabled",
    uptimeSec: Math.round(process.uptime()),
  });
});

// Connect in the background with retry; the HTTP server stays up so the
// platform health check passes even while Atlas is waking up.
const startServer = async () => {
  try {
    const db = await connectedToDB();
    if (db) {
      process.on("SIGINT", async () => {
        console.log("Received SIGINT. Shutting down gracefully...");
        await mongoose.connection.close();
        process.exit(0);
      });
    }
  } catch (err) {
    // Config errors (e.g. missing MONGO_URI) fail fast with a clear message.
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();

// For sending daily reminder notifications to all users.
// Skipped gracefully when Firebase failed to initialize.
cron.schedule(
  "0 18 * * *",
  async () => {
    if (!pushEnabled) {
      console.log("Skipping broadcast: push notifications are disabled.");
      return;
    }
    try {
      await sendBroadcastNotification();
    } catch (error) {
      console.error("Broadcast notification failed:", error.message);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

// Cron Job for Resetting the Daily Status of Habits
cron.schedule(
  "0 0 * * *",
  async () => {
    console.log("Running daily habit reset");
    try {
      await habitModel.resetDailyStatus();
    } catch (error) {
      console.error("Daily habit reset failed:", error.message);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

// Listening to the server at the PORT
app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
