const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      let message;
      if (existingUser.username === username) {
        message = "User already exists with this username!";
      } else if (existingUser.email === email) {
        message = "User already exists with this email!";
      }
      return res.status(400).send(message);
    }

    const newUser = await userModel.create(req.body);
    if (newUser) {
      return res.status(201).json(newUser);
    } else {
      return res.status(400).json({ error: "Failed to sign up new user." });
    }
  } catch (error) {
    console.error("Error occurred while signing up new user:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

const findUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await userModel.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return res.json("No such user exits!!");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      return res.status(200).json({ user });
    } else {
      return res.status(400).json("Invalid Credentials!");
    }
  } catch (error) {
    console.error("Error occurred while logging in user:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

module.exports = { createUser, findUser };
