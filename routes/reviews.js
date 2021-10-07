const express = require('express')
const router = express.Router({mergeParams: true});
const {reviewSchema} = require('../schemas.js')

const Campground = require("../models/campground.js");
const Review = require("../models/review.js");

const catchAsync = require('../utilities/catchAsync.js')
const errorHandle = require('../utilities/errorHandle.js');




const validatorReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
      const msg = error.details.map(msg => msg.message).join(',');
      throw new errorHandle(400, msg)
    }else{
      next()
    }
  }

//Handling a new review post, storing the obj id in the campgrounb reviews arr and the review itself at the reviews collection
router.post("/", validatorReview, catchAsync(async (req, res, next)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
  }))
  
  //Delete a single review
router.delete("/:reviewId", catchAsync( async(req, res, next)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
  }))

  module.exports = router;