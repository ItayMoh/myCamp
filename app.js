//Acquiring necessary variables and packages for the application to run
//express, path, Campground model of mongo, ejs-mate and morgan
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");

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

//Getting all of the campgrounds available in the database and parsing it to the index page
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
});

//Making a new custom campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new.ejs");
});

//Handling the new campground post request
app.post("/campgrounds", async (req, res) => {
  const { campground } = req.body;
  const newCampground = new Campground(campground);
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
});

//Showing information about a single campground
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show.ejs", { campground });
});

//Editing a campground 
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const editCampground = await Campground.findById(id);
  res.render("campgrounds/edit.ejs", { editCampground });
});

//Deleting a campground
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

//Handling a request to modify a campground  
app.patch("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const { campground } = req.body;
  await Campground.findByIdAndUpdate(id, campground, {
    runValidators: true,
  });
  res.redirect(`/campgrounds/${id}`);
});

app.listen(port, () => {
  console.log("Listening on port 3000");
});
