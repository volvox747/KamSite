const mongoose = require("mongoose");
const express = require('express');

//@ Importing common Async-Error handling wrapper function to handle async errors  
const catchAsync=require('../utils/catchAsyncError');


//@ Importing campgroundSchema model
const Campground = require('../model/campground'); 
const route=express.Router();


//@ CREATE

route.get('/newcampground',catchAsync((req,res)=>{
    res.render('newCampground');
}))

route.post('/newcampground/create',catchAsync(async (req,res)=>{
        const newCampGround = new Campground({
            title: req.body.title,
            location: req.body.location,
            price: req.body.price,
            image: req.body.image,
            description: req.body.description,
        });
        await newCampGround.save();
        res.redirect(`/show/${newCampGround._id}`);
    
}))


//@ READ 
route.get('/find',catchAsync(async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("home",{campgrounds});
}))

route.get('/show/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    const showCampGround=await Campground.findById(id);
    res.render("showCampground",{showCampGround});
}))


//@ UPDATE 

route.get('/editcampground/:id/edit',catchAsync(async (req,res)=>{
    const {id}=req.params;
    const editCampGround=await Campground.findById(id);
    res.render('editCampground',{editCampGround})
}))

route.put('/editcampground/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        location: req.body.location,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
      }
    );
    res.redirect(`/show/${id}`);
}))


//@ DELETE

route.delete('/editcampground/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/find');
}))


//? Error handling middleware 
route.use((err,req,res,next)=>{
    //& Destructuring and setting default values for destructured elements 
    const {statusCode=500,message="Something went wrong!!!!"}=err;
    res.status(statusCode).send(message)
})


module.exports=route;


