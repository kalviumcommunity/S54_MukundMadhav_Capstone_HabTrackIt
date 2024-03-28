const express = require("express");
const habitRouter = express.Router();

const {
  getAllHabits,
  getHabitsByUser,
  postHabit,
} = require("../controllers/habitController");

habitRouter.get("/habits", getAllHabits);
habitRouter.get("/habits/user/:username", getHabitsByUser);

habitRouter.post("/habits", postHabit);

module.exports = habitRouter;
