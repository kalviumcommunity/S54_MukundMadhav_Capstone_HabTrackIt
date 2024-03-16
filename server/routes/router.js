const express = require("express");
const router = express.Router();
const connectedToDB = require("../config/db");

const startServer = async () => {
  try {
    db = await connectedToDB();
    process.on("SIGINT", async () => {
      console.log("Received SIGINT. Shutting down gracefully...");
      await db.close();
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
  }
};

startServer();

router.get("/login", (req, res) => {
  res.send("Hello World");
});

module.exports = router;
