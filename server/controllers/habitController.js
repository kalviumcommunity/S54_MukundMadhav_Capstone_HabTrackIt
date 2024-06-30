const { mongoose } = require("mongoose");
const habitModel = require("../models/habitModel");
const UserModel = require("../models/userModel");

const getAllHabits = async (req, res) => {
  try {
    const email = req.user
    // console.log(email)
    const user = await UserModel.findOne({ email: email })
    // console.log(user._id)
    const habits = await habitModel.find({ user: user._id });
    // console.log(habits)
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

const postHabit = async (req, res) => {
  try {
    const email = req.user;
    const { title } = req.body;
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: "Habit title is required." });
    }

    const user = await UserModel.findOne({ email: email })
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    const existingHabit = await habitModel.findOne({ title, user });
    if (existingHabit) {
      return res.status(400).json({
        error: "A habit with the same title already exist for this user.",
      });
    }

    const newHabit = await habitModel.create({ ...req.body, user: user._id });
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
    // console.log(habitId)
    const updateData = req.body;
    // console.log(updateData)
    // Validation of fields to be updated
    const allowedFields = ["title", "status"];
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


const deleteHabit = async (req, res) => {
  try {
    const { deleteId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(deleteId)) {
      return res.status(400).json({ error: "Invalid habit ID." });
    }

    const deletedHabit = await habitModel.findByIdAndDelete(deleteId);
    if (!deletedHabit) {
      return res.status(404).json({ error: "Habit not found." });
    }
    return res.status(200).json({ message: "Habit deleted successfully." });
  } catch (error) {
    console.error("Error occurred while deleting habit:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

module.exports = { getAllHabits, postHabit, updateHabit, deleteHabit };
