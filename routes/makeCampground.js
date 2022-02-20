const mongoose = require("mongoose");
const express = require('express');

//@ Importing common Async-Error handling wrapper function to handle async errors and Custom Error class  
const catchAsync=require('../utils/catchAsyncError');
const ExpressError=require('../utils/ExpressError');

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



//@ This route handles express errors whenever the routes are invalid or does'nt match
route.all('*',catchAsync(async (req,res,next)=>{
    throw new ExpressError('Not Found!!',404);
}))


//? Error handling middleware 
route.use((err,req,res,next)=>{
    //& Destructuring and setting default values for destructured elements 
    if(!err.statusCode) err.statusCode=500;
    else if(!err.message) err.message='Something Wrong';
    res.render('error',{err});
})





module.exports=route;


