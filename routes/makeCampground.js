const express = require("express");
const route = express.Router();

//@ Importing Cloudinary
const {storage} = require('../cloudinary/index');


//@ Imported multer and set image destination to specified folder
const multer = require('multer');
const upload = multer({storage:storage});

//@ Importing common Async-Error handling wrapper function to handle async errors and Custom Error class
const catchAsync = require("../utils/catchAsyncError");



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
    upload.array('image'),// why this is kept on top priority is 'multer' first parses the imgs then sends the req.body
    campgroundValidationFunction, // and this func is dependend on req.body so it is kept second on priority
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