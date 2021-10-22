const Review = require("../models/review.js");
const Campground = require("../models/campground.js");

module.exports.makeRepost = async (req, res, next)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfuly made a review');
    res.redirect(`/campgrounds/${campground._id}`)
  }

module.exports.destroyReview = async(req, res, next)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`)
  }