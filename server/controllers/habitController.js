const { mongoose } = require("mongoose");
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
    console.error("Error occurred while fetching all habits:", error);
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
    console.error("Error occurred while fetching habits by user:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

const postHabit = async (req, res) => {
  try {
    const { title, user } = req.body;
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: "Habit title is required." });
    }

    const existingHabit = await habitModel.findOne({ title, user });
    if (existingHabit) {
      return res.status(400).json({
        error: "A habit with the same title already exist for this user.",
      });
    }

    const newHabit = await habitModel.create(req.body);
    if (newHabit) {
      return res.status(201).json(newHabit);
    } else {
      return res.status(400).json({ error: "Failed to post new Habit!" });
    }
  } catch (error) {
    console.error("Error occurred while posting new habit:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

const updateHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const updateData = req.body;
    // Validation of fields to be updated
    const allowedFields = ["title", "type", "status"];
    const isValidOperation = Object.keys(updateData).every((field) =>
      allowedFields.includes(field)
    );
    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid fields for update." });
    }

    if (!mongoose.Types.ObjectId.isValid(habitId)) {
      return res.status(400).json({ error: "Invalid habit ID." });
    }

    const updatedHabit = await habitModel.findByIdAndUpdate(
      habitId,
      updateData,
      { new: true }
    );
    if (!updatedHabit) {
      return res.status(404).json({ error: "Habit not found." });
    }
    return res.status(200).json(updatedHabit);
  } catch (error) {
    console.error("Error occurred while updating habit:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

module.exports = { getAllHabits, getHabitsByUser, postHabit, updateHabit };
