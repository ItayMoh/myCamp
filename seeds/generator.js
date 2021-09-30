//Generating a random information to mongodb for the application

const mongoose = require("mongoose");
const Campground = require("../models/campground.js");
const { descriptors, places } = require("./seedHelpers.js");
const cities = require("./cities.js");

main();

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async function () {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const price = Math.floor(Math.random() * 20) + 10
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)}, ${sample(places)}`,
      image: `https://source.unsplash.com/collection/483251`,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero voluptas, eos, harum placeat aliquid totam, vel cumque iusto veritatis iste ipsam. Harum quisquam ipsam unde est dolor quam sed deleniti.',
      price
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
