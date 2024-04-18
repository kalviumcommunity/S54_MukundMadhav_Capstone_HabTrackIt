const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const connectedToDB = require("./config/db");
const habitRouter = require("./routes/habitRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
const server = createServer(app);


const io = new Server(server, {
  cors: {
    origin: getCorsOrigin(),
    methods: ["GET", "POST"],
    credentials: true,
  },
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
});

// For Using all the routes
app.use("/", habitRouter);
app.use("/", userRouter);

// For connecting and disconnecting from the server
const startServer = async () => {
  try {
    db = await connectedToDB();
    process.on("SIGINT", async () => {
      console.log("Received SIGINT. Shutting down gracefully...");
      io.close();
      await db.close();
      process.exit(0);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();

// Listening to the server at the PORT
server.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
