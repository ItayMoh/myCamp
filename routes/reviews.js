const express = require('express')
const router = express.Router({mergeParams: true});

const Campground = require("../models/campground.js");
const Review = require("../models/review.js");

const catchAsync = require('../utilities/catchAsync.js')

//Importing validators from middleware.js
const {loggedIn, validatorReview, isReviewAuthor} = require('../middleware.js')

//Handling a new review post, storing the obj id in the campgrounb reviews arr and the review itself at the reviews collection
router.post("/", loggedIn, validatorReview, catchAsync(async (req, res, next)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfuly made a review');
    res.redirect(`/campgrounds/${campground._id}`)
  }))
  
  //Delete a single review
router.delete("/:reviewId", loggedIn, isReviewAuthor, catchAsync( async(req, res, next)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`)
  }))

  module.exports = router;