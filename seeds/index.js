//@ Importing Mongoose 
const mongoose = require("mongoose");

//@ Importing data from seeds folder
const cities=require("../seeds/cities");
const {descriptors,places}=require("../seeds/seedHelpers");

//!       (or in other ways)
// const descriptors=require("../seeds/seedHelpers").descriptors; 
// const places=require("../seeds/seedHelpers").places 


//@ Importing Model
const Campground = require("../model/campground");

const dataBase= async ()=>{
    await Campground.deleteMany({});

    for(let i=0;i<=300;i++)
    {
        const random1000=Math.floor(Math.random()*1000);
        const campground=new Campground({title:cities[random1000]},location:`${sampleLocation()}`)
    }
}




mongoose
  .connect("mongodb://localhost:27017/kam-site")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    new Error(e).message;
  });
