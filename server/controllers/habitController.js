const habitModel = require("../models/habitModel");

const getAllHabits = async (req, res) => {
  try {
    const habits = await habitModel.find({});
    if (habits.length > 0) {
      return res.status(200).json(habits);
    } else {
      return res
        .status(404)
        .json({ message: "No habits found in the collection." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

const getHabitsByUser = async (req, res) => {
  try {
    const userName = req.params.username;
    const habits = await habitModel.find({ username: userName });
    if (habits.length > 0) {
      return res.status(200).json(habits);
    } else {
      return res
        .status(404)
        .json({ message: "No habits found for this user." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

module.exports = { getAllHabits, getHabitsByUser };
