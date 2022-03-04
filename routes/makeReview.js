const express = require("express");
const route = express.Router({
  mergeParams: true
});


//@ Importing common Async-Error handling wrapper function to handle async errors and Custom Error class  
const catchAsync = require('../utils/catchAsyncError');


//@ Importing isLoggedIn and reviewValidationFunction middleware
const {
  isLoggedIn,
  reviewValidationFunction
} = require('../middleware');

//@ Importing Review controller
const review=require('../controllers/review');

/* ***************************************************************************************************************************************************************
 ? Create a review route to post the reviews of particular campground 
 ****************************************************************************************************************************************************************/

route.post('/showcampground/:id/review', isLoggedIn, reviewValidationFunction, catchAsync(review.postReview))



/* ***************************************************************************************************************************************************************
 ? Create a delete route to delete the reviews of particular campground 
 ****************************************************************************************************************************************************************/


route.delete('/showcamground/:campid/review/:revid', isLoggedIn, catchAsync(review.deleteReview))



module.exports = route