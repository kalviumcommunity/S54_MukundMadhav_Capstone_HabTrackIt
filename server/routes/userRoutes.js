const express = require("express");
const userRouter = express.Router();

const {
  createUser,
  findUser,
  updateUser,
  ifUserExists,
  updateUserProfilePicture,
  findUserAndSendData,
  findAllUsersForLeaderboard,
} = require("../controllers/userController");

userRouter.get("/leads", findAllUsersForLeaderboard);

userRouter.post("/signup", createUser);
userRouter.post("/login", findUser);
userRouter.post("/existing-user", findUserAndSendData);
userRouter.post("/identify-user", ifUserExists);

userRouter.put("/reset-password", updateUser);
userRouter.put("/update-profile-picture", updateUserProfilePicture);

module.exports = userRouter;
