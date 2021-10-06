'strict mode'

//Acquiring necessary variables and packages for the application to run
//express, path, Campground model of mongo, ejs-mate and morgan
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Joi = require('joi')
const Campground = require("./models/campground.js");
const catchAsync = require('./utilities/catchAsync.js')
const errorHandle = require('./utilities/errorHandle.js');
const Review = require("./models/review.js");
const {campgroundSchemajoi, reviewSchema} = require('./schemas.js')
const campgrounds = require('./routes/campground.js')

main();

//Connecting to the application database
async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/yelpCamp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log(err);
  }
}

//Using ejs template and ejsMate package to deliver dynamic pages
app.engine("ejs", ejsMate);
app.use(morgan("tiny"));
app.set("view engine", "ejs");

//using method override to handle other requests than POST or GET
app.use(methodOverride("_method"));

//Making views as the folder the pages would be served from
app.set("views", path.join(__dirname, "views"));

//Setting the application to accept post data and parse it as json 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const validatorReview = (req, res, next) =>{
  const {error} = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(msg => msg.message).join(',');
    throw new errorHandle(400, msg)
  }else{
    next()
  }
}

//Routed for all campgrounds related logic
app.use('/campgrounds', campgrounds);

//Handling a new review post, storing the obj id in the campgrounb reviews arr and the review itself at the reviews collection
app.post("/campgrounds/:id/reviews", validatorReview, catchAsync(async (req, res, next)=>{
  const campground = await Campground.findById(req.params.id)
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
}))

//Delete a single review
app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync( async(req, res, next)=>{
  const {id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId)
  res.redirect(`/campgrounds/${id}`)
}))

app.all('*', (req, res, next)=>{
  next(new errorHandle(404, 'Could\'nt find page'))
})

app.use((err, req, res, next) =>{
  const {statusCode = 500} = err
  if(!err.message) err.message = 'OOPs Something went wrong'
  res.status(statusCode).render('campgrounds/error.ejs', {err})
})


app.listen(port, () => {
  console.log("Listening on port 3000");
});
