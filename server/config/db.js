const mongoose = require("mongoose");
require("dotenv").config();

const MAX_RETRIES = 8;
const BASE_DELAY_MS = 2000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fail fast on missing config — a bad deploy should surface once, loudly.
function assertConfig() {
  if (!process.env.MONGO_URI) {
    throw new Error(
      "MONGO_URI environment variable is missing. Set it on your hosting platform and redeploy."
    );
  }
}

const connectToDB = async (retries = MAX_RETRIES) => {
  assertConfig();

  // Never kill the process on a transient DB failure (Atlas free-tier
  // pauses, Railway sleep/wake races). Retry with exponential backoff and
  // keep the HTTP server alive so the platform stops reporting crashes.
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log("Connected to MongoDB. 🚀");
      return mongoose.connection;
    } catch (error) {
      console.error(
        `MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`
      );
      if (attempt === retries) {
        console.error(
          "Giving up on initial connect. Server stays up; mongoose will keep retrying in the background."
        );
        return null;
      }
      await sleep(BASE_DELAY_MS * Math.pow(2, attempt - 1));
    }
  }
  return null;
};

module.exports = connectToDB;
