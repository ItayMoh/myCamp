const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync.js');
const errorHandle = require('../utilities/errorHandle.js');

const Campground = require("../models/campground.js");
const {campgroundSchemajoi} = require('../schemas.js');
const {loggedIn} = require('../middleware.js')



//Using joi as a middleware to validate the form data
const validatorCampground = (req, res, next) =>{
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


  //Getting all of the campgrounds available in the database and parsing it to the index page
  router.get("/", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
  });
  
  //Making a new custom campground
  router.get("/new", loggedIn, (req, res) => {
    res.render("campgrounds/new.ejs");
  });
  
  //Handling the new campground post request
  router.post("/", loggedIn, validatorCampground, catchAsync(async (req, res, next) => {
      const {campground} = req.body;
      const newCampground = new Campground(campground);
      await newCampground.save();
      req.flash('success', 'Successfuly made a new campground');
      res.redirect(`/campgrounds/${newCampground._id}`);
  }));
  
  //Showing information about a single campground
  router.get("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error', 'Campground doesn\'t exist');
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show.ejs", { campground });
  }));
  
  //Editing a campground 
  router.get("/:id/edit", loggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const editCampground = await Campground.findById(id);
    if(!editCampground){
        req.flash('error', 'Campground doesn\'t exist');
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit.ejs", { editCampground });
  }));
  
  //Deleting a campground
  router.delete("/:id", loggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfuly deleted campground');
    res.redirect("/campgrounds");
  }));

  //Handling a request to modify a campground  
  router.patch("/:id", loggedIn, validatorCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { campground } = req.body;
    await Campground.findByIdAndUpdate(id, campground, {
      runValidators: true,
    });
    req.flash('success', 'Successfuly updated campground');
    res.redirect(`/campgrounds/${id}`);
  }));
  

module.exports = router;