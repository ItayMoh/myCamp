const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max:10,
  }
});

module.exports = mongoose.model("review", reviewSchema);
