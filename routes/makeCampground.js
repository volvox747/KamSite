const express = require("express");
const route = express.Router();


//@ Importing common Async-Error handling wrapper function to handle async errors and Custom Error class
const catchAsync = require("../utils/catchAsyncError");

//@ Importing Campground Model
const Campground = require("../model/campground");

//@ Importing isLoggedIn middleware
const {
    isLoggedIn,
    isAuthor,
    campgroundValidationFunction,
} = require("../middleware");


//@ Importing Controllers having body of camground routes
const campground = require('../controllers/campground');

//$ CREATE



route.get(
    "/newcampground",
    isLoggedIn,
    catchAsync(campground.showNewCampGround)
);

//@ validationFunction middleware is used so that server side validation is done before saving to the database
route.post(
    "/newcampground/create",
    campgroundValidationFunction,
    catchAsync(campground.postNewCampGround)
);

//$ READ
route.get(
    "/find",
    catchAsync(campground.index)
);

route.get(
    "/show/:id",
    catchAsync(campground.showCampGround)
);

//$ UPDATE

route.get(
    "/editcampground/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(campground.getUpdateCampGround)
);

//@ validationFunction middleware is used so that server side validation is done before saving to the database
route.put(
    "/editcampground/:id",
    campgroundValidationFunction,
    catchAsync(campground.updateCampGround)
);

//$ DELETE

route.delete(
    "/editcampground/:id",
    isLoggedIn,
    isAuthor,
    catchAsync(campground.deleteCampGround)
);

module.exports = route;