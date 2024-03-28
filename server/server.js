const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const connectedToDB = require("./config/db");
const habitRouter = require("./routes/habitRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// For Using all the routes
app.use("/", habitRouter);

// For connecting and disconnecting from the server
const startServer = async () => {
  try {
    db = await connectedToDB();
    process.on("SIGINT", async () => {
      console.log("Received SIGINT. Shutting down gracefully...");
      await db.close();
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
