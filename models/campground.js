const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const campGroundSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  description: {
    type: String,
  },
  location: {
    required: true,
    type: String,
  },
  image:{
    type:String,

  }
});

module.exports = mongoose.model("Campground", campGroundSchema);
