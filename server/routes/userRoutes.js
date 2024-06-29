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
  updateUserTokens,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");

userRouter.get("/leads", findAllUsersForLeaderboard);

userRouter.post("/signup", createUser);
userRouter.post("/login", findUser);
userRouter.post("/existing-user", authenticateToken, findUserAndSendData);
userRouter.post("/identify-user", ifUserExists);

userRouter.put("/reset-password", updateUser);
userRouter.put(
  "/update-profile-picture",
  authenticateToken,
  updateUserProfilePicture
);

userRouter.patch("/save-fcm-token", authenticateToken, updateUserTokens);

module.exports = userRouter;
