const mongoose = require("mongoose");
const UserModel = require("./userModel");
const moment = require("moment-timezone");

const habitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["good", "bad"],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    lastResetDate: {
      type: Date,
      default: () => moment().tz("Asia/Kolkata").startOf("day").toDate(),
    },
  },
  { timestamps: true }
);

habitSchema.statics.resetDailyStatus = async function () {
  const today = moment().tz("Asia/Kolkata").startOf("day");
  const result = await this.updateMany(
    {
      lastResetDate: { $lt: today.toDate() },
    },
    {
      $set: {
        status: false,
        lastResetDate: today.toDate(),
      },
    }
  );
  console.log(`Reset status for ${result.modifiedCount} habits`);
};

habitSchema.statics.markCompleted = async function (habitId) {
  const today = moment().tz("Asia/Kolkata").startOf("day");
  const result = await this.findByIdAndUpdate(
    habitId,
    {
      $set: {
        status: true,
        lastResetDate: today.toDate(),
      },
    },
    { new: true }
  );
  return result;
};

const habitModel = mongoose.model("habits", habitSchema);

module.exports = habitModel;
