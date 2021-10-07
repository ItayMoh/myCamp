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
const errorHandle = require('./utilities/errorHandle.js');

const session = require('express-session')
const flash = require('connect-flash')

//Importing routes
const campgrounds = require('./routes/campground.js')
const reviews = require('./routes/reviews.js')

//Using ejs template and ejsMate package to deliver dynamic pages
app.engine("ejs", ejsMate);
app.use(morgan("tiny"));
app.set("view engine", "ejs");

//using method override to handle other requests than POST or GET
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname,'public')))

//Making views as the folder the pages would be served from
app.set("views", path.join(__dirname, "views"));

//Setting the application to accept post data and parse it as json 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const sessionConfig = {
  secret: 'test',
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 1000*60*60*24*7, // The date is received in mseconds and we add a week in msocnds to it
    maxAge: 1000*60*60*24*7,
    httpOnly: true,
  }
}
app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error')
  next();
})

//Routed for all campgrounds related logic
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);


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
