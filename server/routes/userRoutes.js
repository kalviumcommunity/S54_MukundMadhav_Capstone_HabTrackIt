const express = require("express");
const userRouter = express.Router();

const {
  createUser,
  findUser,
  updateUser,
  ifUserExists,
  updateUserProfilePicture,
} = require("../controllers/userController");

const userValidator = require("../middlewares/userValidator");

userRouter.post("/signup", userValidator, createUser);
userRouter.post("/login", findUser);
userRouter.post("/existing-user", ifUserExists);

userRouter.put("/reset-password", updateUser);
userRouter.put("/update-profile-picture", updateUserProfilePicture);

module.exports = userRouter;
