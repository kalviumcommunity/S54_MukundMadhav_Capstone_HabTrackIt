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
      ref: UserModel,
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
  if (!this.isNew || now.getDate() !== this._doc.lastUpdatedDate?.getDate()) {
    this.status = false;
    this.lastUpdatedDate = now;
  }
  next();
});

const habitModel = mongoose.model("habits", habitSchema);

module.exports = habitModel;
