const {campgroundSchemajoi} = require('./schemas.js');
const errorHandle = require('./utilities/errorHandle.js')
const Campground = require("./models/campground.js");
const {reviewSchema} = require('./schemas.js')
const Review = require('./models/review.js')


module.exports.loggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        //Store the url a user requests and after he successfully logging in, redirect to there
        req.session.originatedUrlFrom = req.originalUrl;
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next();
}

module.exports.alreadyLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        req.flash('error', `You are already logged in`)
        return res.redirect('/campgrounds')
    }
    next();
}

//Using joi as a middleware to validate the form data
module.exports.validatorCampground = (req, res, next) =>{
    //Checking for an error
    const {error} = campgroundSchemajoi.validate(req.body);
    if(error) {
      //Forming a message from the joi details object array
      const msg = error.details.map(msg => msg.message).join(',');
      throw new errorHandle(400, msg)
    }else{
      next()
    }
  }

module.exports.isAuthorized = async(req, res, next)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
      req.flash('error', 'Unauthorized to do this action');
      return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next)=>{
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)){
    req.flash('error', 'Unauthorized to do this action');
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}

module.exports.validatorReview = (req, res, next) =>{
  const {error} = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(msg => msg.message).join(',');
    throw new errorHandle(400, msg)
  }else{
    next()
  }
}