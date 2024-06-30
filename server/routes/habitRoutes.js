const express = require("express");
const habitRouter = express.Router();

const {
  getAllHabits,
  postHabit,
  updateHabit,
  deleteHabit,
} = require("../controllers/habitController");

const authenticateToken = require("../middlewares/authenticateToken")
const habitValidator = require("../middlewares/habitValidator");

habitRouter.get("/habits", authenticateToken, getAllHabits);

habitRouter.post("/habits", authenticateToken, habitValidator, postHabit);

habitRouter.put("/habits/update/:habitId", habitValidator, updateHabit);

habitRouter.delete("/habits/delete/:deleteId", deleteHabit)

module.exports = habitRouter;
