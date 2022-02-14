const mongoose = require("mongoose");
const express = require('express');



//@ Importing campgroundSchema model
const Campground = require('../model/campground'); 
const route=express.Router();


//@ CREATE

route.get('/newcampground',(req,res)=>{
    res.render('newCampground');
})

route.post('/newcampground/create',async (req,res)=>{
    console.log(req.body);
    const newCampGround=new Campground({title:req.body.title,location:req.body.location});
    await newCampGround.save();
    console.log("Added a new Campground");
})


//@ READ 
route.get('/find',async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("home",{campgrounds});
})












// route.get('/createpost',async (req,res)=>{
//     const samplePost = await new Campground({
//       title: "Wayanad",
//       price: "$30",
//       description:"Good Place"
//     });
//     samplePost.save().then(() => {
//         console.log("Successfully saved");
//         res.json(samplePost);
//     }).catch((err) => {
//         console.log(new Error(err).message, res.statusCode);
//     });
// })


// route.delete('/:postId',async (req,res)=>{
//     const {postId}=req.params;
//     console.log(postId);
//     const delPost=await Campground.findByIdAndDelete(postId);
//     res.json(delPost);
// })


module.exports=route;


