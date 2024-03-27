const mongoose = require("mongoose");
const UserModel = require("./userModel");

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
      ref: user,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

habitSchema.pre("save", function (next) {
  const now = new Date();
  // Check if it's a new document or if the lastUpdatedDate needs to be updated
  if (this.isNew || this.modifiedPaths().includes("status")) {
    this.status = false;
    this.lastUpdatedDate = now;
  } else if (
    !this.isNew &&
    this.lastUpdatedDate &&
    now.getDate() !== this.lastUpdatedDate.getDate()
  ) {
    // Reset status to false if it's a new day
    this.status = false;
    this.lastUpdatedDate = now;
  }
  next();
});

const habitModel = mongoose.model("habits", habitSchema);

module.exports = habitModel;
