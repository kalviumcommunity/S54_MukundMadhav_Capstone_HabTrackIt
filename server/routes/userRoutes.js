const express = require("express");
const userRouter = express.Router();

const {
  createUser,
  findUser,
  updateUser,
} = require("../controllers/userController");

userRouter.post("/signup", createUser);
userRouter.post("/login", findUser);

userRouter.put("/reset-password", updateUser);

module.exports = userRouter;
