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
  },
  author:{
    type: Schema.Types.ObjectId,
    ref:'User'
  }
});

module.exports = mongoose.model("review", reviewSchema);
