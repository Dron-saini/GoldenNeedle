const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true
    },
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);