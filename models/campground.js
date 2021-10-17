const mongoose = require("mongoose");
const Review = require('./review.js')
const Schema = mongoose.Schema;

//A schema for a campground
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
  },
  author:{
    type:Schema.Types.ObjectId,
    ref:'User',
  },
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref:'review'
    }
  ]
});

//Mongoose middleware, deleting all the of a campground reviews after deleting that campground
campGroundSchema.post('findOneAndDelete', async function(camp){
  if(camp){
    await Review.deleteMany({
      _id:{
        $in: camp.reviews
      }
    })
  }
});

module.exports = mongoose.model("Campground", campGroundSchema);
