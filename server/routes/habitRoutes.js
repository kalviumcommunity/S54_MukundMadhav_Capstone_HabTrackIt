const express = require("express");
const habitRouter = express.Router();

const {
  getAllHabits,
  getHabitsByUser,
  postHabit,
  updateHabit,
} = require("../controllers/habitController");

const habitValidator = require("../middlewares/habitValidator");

habitRouter.get("/habits", getAllHabits);
habitRouter.get("/habits/user/:userId", getHabitsByUser);

habitRouter.post("/habits", habitValidator, postHabit);

habitRouter.put("/habits/update/:habitId", habitValidator, updateHabit);

module.exports = habitRouter;
