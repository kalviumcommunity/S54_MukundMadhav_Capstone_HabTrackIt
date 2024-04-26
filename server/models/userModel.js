const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  signedUpAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
