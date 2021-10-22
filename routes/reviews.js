const express = require('express')
const router = express.Router({mergeParams: true});
const review = require('../controllers/reviews.js')

const Campground = require("../models/campground.js");
const Review = require("../models/review.js");

const catchAsync = require('../utilities/catchAsync.js')

//Importing validators from middleware.js
const {loggedIn, validatorReview, isReviewAuthor} = require('../middleware.js')

//Handling a new review post, storing the obj id in the campgrounb reviews arr and the review itself at the reviews collection
router.post("/", loggedIn, validatorReview, catchAsync(review.makeRepost))
  
  //Delete a single review
router.delete("/:reviewId", loggedIn, isReviewAuthor, catchAsync(review.destroyReview))

module.exports = router;