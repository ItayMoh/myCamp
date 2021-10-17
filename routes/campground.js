const express = require('express');
const router = express.Router();

//Importing Error handling functions
const catchAsync = require('../utilities/catchAsync.js');
const errorHandle = require('../utilities/errorHandle.js');

const Campground = require("../models/campground.js");

// Importing validation helper function from middlware.js
const {loggedIn, validatorCampground, isAuthorized} = require('../middleware.js')


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
      newCampground.author = req.user._id;
      await newCampground.save();
      req.flash('success', 'Successfuly made a new campground');
      res.redirect(`/campgrounds/${newCampground._id}`);
  }));
  
  //Showing information about a single campground
  router.get("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({path:'reviews', populate: {path: 'author'}}).populate('author');
    if(!campground){
        req.flash('error', 'Campground doesn\'t exist');
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show.ejs", { campground });
  }));
  
  //Editing a campground 
  router.get("/:id/edit", loggedIn, isAuthorized, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground doesn\'t exist');
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit.ejs", { campground });
  }));
  
  //Deleting a campground
  router.delete("/:id", loggedIn, isAuthorized, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfuly deleted campground');
    res.redirect("/campgrounds");
  }));

  //Handling a request to modify a campground  
  router.patch("/:id", loggedIn, isAuthorized, validatorCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { camp } = req.body;
    await Campground.findByIdAndUpdate(id, camp, {
      runValidators: true,
    });
    req.flash('success', 'Successfuly updated campground');
    res.redirect(`/campgrounds/${id}`);
  }));
  

module.exports = router;