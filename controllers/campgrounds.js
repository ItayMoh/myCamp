const Campground = require("../models/campground.js");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
  }

module.exports.newForm = (req, res) => {
    res.render("campgrounds/new.ejs");
  }

module.exports.postCampground = async (req, res, next) => {
    const {campground} = req.body;
    const newCampground = new Campground(campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfuly made a new campground');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.show = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({path:'reviews', populate: {path: 'author'}}).populate('author');
    if(!campground){
        req.flash('error', 'Campground doesn\'t exist');
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show.ejs", { campground });
  }

  module.exports.edit = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground doesn\'t exist');
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit.ejs", { campground });
  }

  module.exports.delete = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfuly deleted campground');
    res.redirect("/campgrounds");
  }

  module.exports.modify = async (req, res, next) => {
    const { id } = req.params;
    const { camp } = req.body;
    await Campground.findByIdAndUpdate(id, camp, {
      runValidators: true,
    });
    req.flash('success', 'Successfuly updated campground');
    res.redirect(`/campgrounds/${id}`);
  }