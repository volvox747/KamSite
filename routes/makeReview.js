const express = require("express");
const route = express.Router({mergeParams:true});


//@ Importing Campground Model and Review Model
const Campground = require('../model/campground');
const Review = require("../model/review");
 

//@ Importing reviewValidationSchema to validate the review data or server side validation  
const {reviewValidationSchema}=require('../schemas');


//@ Importing common Async-Error handling wrapper function to handle async errors and Custom Error class  
const catchAsync = require('../utils/catchAsyncError');
const ExpressError = require('../utils/ExpressError');



//@ Login middleware 
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You are not logged in");
    res.redirect("/login");
  }
  next();
};


//@ CampGround Validation Function 

const reviewValidationFunction = (req, res, next) => {
  
  //@ validating the incoming data using the above defined model
  const validatedResult = reviewValidationSchema.validate(req.body);

  //@ destructuring the "error" object to handle any server side errors
  const { error } = validatedResult;

  //@ if any error take the "details"(array of objs) value inside the error object
  if (error) 
  {
    //@ using "map" to map the object's msg from details
    //@ using "join" to join, if there are more than 1 msg
    const msg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};




/* ***************************************************************************************************************************************************************
 ? Create a review route to post the reviews of particular campground 
 ****************************************************************************************************************************************************************/

route.post('/showcampground/:id/review',isLoggedIn,reviewValidationFunction,catchAsync(async(req,res)=>{
const {id}=req.params;
const campground=await Campground.findById(id);
const review =new Review(req.body);
await review.save();
campground.reviews.push(review);
await campground.save();
req.flash('success',"Created a new Review!!");
res.redirect(`/campground/show/${id}`);
}))



/* ***************************************************************************************************************************************************************
 ? Create a delete route to delete the reviews of particular campground 
 ****************************************************************************************************************************************************************/


route.delete('/showcamground/:campid/review/:revid',isLoggedIn, catchAsync(async(req,res)=>{
    const {campid,revid}=req.params;
    await Campground.findByIdAndUpdate(campid,{$pull:{reviews:revid}});
    await Review.findByIdAndDelete(revid);
    req.flash('error',"Deleted a Review");
    res.redirect(`/campground/show/${campid}`);
}))



module.exports=route