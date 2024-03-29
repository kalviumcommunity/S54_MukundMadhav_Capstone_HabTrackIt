const express = require("express");
const habitRouter = express.Router();

const {
  getAllHabits,
  getHabitsByUser,
  postHabit,
  updateHabit,
} = require("../controllers/habitController");

habitRouter.get("/habits", getAllHabits);
habitRouter.get("/habits/user/:userId", getHabitsByUser);

habitRouter.post("/habits", postHabit);

habitRouter.put("/habits/update/:habitId", updateHabit);

module.exports = habitRouter;
