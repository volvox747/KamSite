const express = require("express");
const route = express.Router({
  mergeParams: true
});


//@ Importing Campground Model and Review Model
const Campground = require('../model/campground');
const Review = require("../model/review");


//@ Importing common Async-Error handling wrapper function to handle async errors and Custom Error class  
const catchAsync = require('../utils/catchAsyncError');


//@ Importing isLoggedIn and reviewValidationFunction middleware
const {
  isLoggedIn,
  reviewValidationFunction
} = require('../middleware');



/* ***************************************************************************************************************************************************************
 ? Create a review route to post the reviews of particular campground 
 ****************************************************************************************************************************************************************/

route.post('/showcampground/:id/review', isLoggedIn, reviewValidationFunction, catchAsync(async (req, res) => {
  const {
    id
  } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body);
  let ans = req.user._id.toString(); //req.user._id will be in new ObjectId('5345363c453453') format which cannot be inserted into mongoDB
  review.author = ans;
  await review.save();
  campground.reviews.push(review);
  await campground.save();
  req.flash('success', "Created a new Review!!");
  res.redirect(`/campground/show/${id}`);
}))



/* ***************************************************************************************************************************************************************
 ? Create a delete route to delete the reviews of particular campground 
 ****************************************************************************************************************************************************************/


route.delete('/showcamground/:campid/review/:revid', isLoggedIn, catchAsync(async (req, res) => {
  const {
    campid,
    revid
  } = req.params;
  await Campground.findByIdAndUpdate(campid, {
    $pull: {
      reviews: revid
    }
  });
  await Review.findByIdAndDelete(revid);
  req.flash('error', "Deleted a Review");
  res.redirect(`/campground/show/${campid}`);
}))



module.exports = route