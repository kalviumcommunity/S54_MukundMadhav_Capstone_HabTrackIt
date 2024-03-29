const express = require("express");
const userRouter = express.Router();

const {
  createUser,
  findUser,
  updateUser,
} = require("../controllers/userController");

const userValidator = require("../middlewares/userValidator");

userRouter.post("/signup", userValidator, createUser);
userRouter.post("/login", findUser);

userRouter.put("/reset-password", updateUser);

module.exports = userRouter;
