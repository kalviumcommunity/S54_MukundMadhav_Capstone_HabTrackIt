const express = require("express");
const habitRouter = express.Router();

const {
  getAllHabits,
  getHabitsByUser,
} = require("../controllers/habitController");

habitRouter.get("/habits", getAllHabits);
habitRouter.get("/habits/id/:userId", getHabitsByUser);

module.exports = habitRouter;
