const express = require('express');
const router = express.Router();

//Importing Error handling functions
const catchAsync = require('../utilities/catchAsync.js');
const errorHandle = require('../utilities/errorHandle.js');
const campgrounds = require('../controllers/campgrounds.js')

const Campground = require("../models/campground.js");

// Importing validation helper function from middlware.js
const {loggedIn, validatorCampground, isAuthorized} = require('../middleware.js')


  //Getting all of the campgrounds available in the database and parsing it to the index page
  //Handling the new campground post request
  router.route('/')
  .get(catchAsync(campgrounds.index))
  .post(loggedIn, validatorCampground, catchAsync(campgrounds.postCampground));

  //Making a new custom campground
  router.get("/new", loggedIn, campgrounds.newForm);

  //Showing information about a single campground
  //Handling a request to modify a campground  
  //Deleting a campground
  router.route('/:id')
  .get(catchAsync(campgrounds.show))
  .delete(loggedIn, isAuthorized, catchAsync(campgrounds.delete))
  .patch(loggedIn, isAuthorized, validatorCampground, catchAsync(campgrounds.modify));

  //Editing a campground 
  router.get("/:id/edit", loggedIn, isAuthorized, catchAsync(campgrounds.edit));
 

module.exports = router;