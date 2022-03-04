//@ Importing Mongoose 
const mongoose = require("mongoose");

//@ Importing data from seeds folder
const cities = require("../seeds/cities");
const {
    descriptors,
    places
} = require("../seeds/seedHelpers");

//!       (or in other ways)
// const descriptors=require("../seeds/seedHelpers").descriptors; 
// const places=require("../seeds/seedHelpers").places 

//@ Connecting to Database 
mongoose
    .connect("mongodb://localhost:27017/kam-site")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((e) => {
        new Error(e).message;
    });


//@ Importing Model
const Campground = require("../model/campground");



//@ Delete the existing contents from Database
//@ Insert new data into the database from dummy data   
const dataBase = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i <= 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 1000);
        const campground = new Campground({
            author:'6220da794773d1e9f3099202',
          title:
            descriptors[Math.floor(Math.random() * descriptors.length)] +
            " " +
            places[Math.floor(Math.random() * places.length)],
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          price, //& which means price:price(i.e, pairs have same name)
          image: "https://source.unsplash.com/random/700x700/?in-the-woods",
          description:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta laudantium temporibus dolorem rem repudiandae itaque fugiat consectetur qui. Dicta praesentium sapiente mollitia expedita quo? Libero pariatur error eaque eos amet!",
        });

        await campground.save();
    }
}


dataBase().then(() => mongoose.connection.close());