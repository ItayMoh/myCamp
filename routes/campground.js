const express = require('express')
const router = express.Router();

const catchAsync = require('../utilities/catchAsync.js')
const errorHandle = require('../utilities/errorHandle.js');

const Campground = require("../models/campground.js");
const {campgroundSchemajoi} = require('../schemas.js')



//Using joi as a middleware to validate the form data
const validatorCampground = (req, res, next) =>{
    //Checking for an error
    const {error} = campgroundSchemajoi.validate(req.body)
    if(error) {
      //Forming a message from the joi details object array
      const msg = error.details.map(msg => msg.message).join(',');
      throw new errorHandle(400, msg)
    }else{
      next()
    }
  }


//Getting all of the campgrounds available in the database and parsing it to the index page
router.get("/", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
  });
  
  //Making a new custom campground
  router.get("/new", (req, res) => {
    res.render("campgrounds/new.ejs");
  });
  
  //Handling the new campground post request
  router.post("/", validatorCampground, catchAsync(async (req, res, next) => {
      const newCampground = new Campground(campground);
      await newCampground.save();
      res.redirect(`/campgrounds/${newCampground._id}`);
  }));
  
  //Showing information about a single campground
  router.get("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render("campgrounds/show.ejs", { campground });
  }));
  
  //Editing a campground 
  router.get("/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const editCampground = await Campground.findById(id);
    res.render("campgrounds/edit.ejs", { editCampground });
  }));
  
  //Deleting a campground
  router.delete("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  }));

  //Handling a request to modify a campground  
router.patch("/:id", validatorCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { campground } = req.body;
    await Campground.findByIdAndUpdate(id, campground, {
      runValidators: true,
    });
    res.redirect(`/campgrounds/${id}`);
  }));
  

  module.exports = router;