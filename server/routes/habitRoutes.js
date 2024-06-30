const express = require("express");
const habitRouter = express.Router();

const {
  getAllHabits,
  postHabit,
  updateHabit,
} = require("../controllers/habitController");

const authenticateToken = require("../middlewares/authenticateToken")
const habitValidator = require("../middlewares/habitValidator");

habitRouter.get("/habits", authenticateToken, getAllHabits);

habitRouter.post("/habits", habitValidator, postHabit);

habitRouter.put("/habits/update/:habitId", habitValidator, updateHabit);

module.exports = habitRouter;
