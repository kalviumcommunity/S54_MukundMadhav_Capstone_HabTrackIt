const mongoose = require("mongoose");
require("dotenv").config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB. 🚀");
    return mongoose.connection;
  } catch (error) {
    console.error(
      `Failed to connect to MongoDB. Error Message: ${error.message}`
    );
  }
};

module.exports = connectToDB;
