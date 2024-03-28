const express = require("express");
const habitRouter = express.Router();

const {
  getAllHabits,
  getHabitsByUser,
} = require("../controllers/habitController");

habitRouter.get("/habits", getAllHabits);
habitRouter.get("/habits/user/:username", getHabitsByUser);

module.exports = habitRouter;
