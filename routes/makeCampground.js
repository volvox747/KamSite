const express = require('express');

//@ Importing a validation tool 'JOI' which is easy when compared to writing custome or manually validations
//@ This tool was introduced as it is easy to validate rather than writing custom validations
const Joi = require('joi');

//@ Importing validationSchema to validate the data or server side validation  
const {campgroundValidationSchema,reviewValidationSchema}=require('../schemas');


//@ Importing common Async-Error handling wrapper function to handle async errors and Custom Error class  
const catchAsync = require('../utils/catchAsyncError');
const ExpressError = require('../utils/ExpressError');

//@ Importing campgroundSchema and Review model
const Campground = require('../model/campground');
const Review = require('../model/review');

const route = express.Router();


const campgroundValidationFunction= (req,res,next)=>{
  //@ validating the incoming data using the above defined model
  const validatedResult = campgroundValidationSchema.validate(req.body);

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
}

const reviewValidationFunction=(req,res,next)=>{
  const validatedResult = campgroundValidationSchema.validate(req.body);
  const { error } = validatedResult;
  if (error) 
  {
    const msg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
}




//$ CREATE

route.get('/newcampground', catchAsync((req, res) => {
    res.render('newCampground');
}))

//@ validationFunction middleware is used so that server side validation is done before saving to the database 
route.post('/newcampground/create', campgroundValidationFunction, catchAsync(async (req, res) => {
    
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


/* ***************************************************************************************************************************************************************
 ? Create a review route to post the reviews of particular campground 
 ****************************************************************************************************************************************************************/

route.post('/showcampground/:id/review',reviewValidationFunction,catchAsync(async(req,res)=>{
const {id}=req.params;
const campground=await Campground.findById(id);
const review =new Review(req.body);
await review.save();
campground.reviews.push(review);
await campground.save();
console.log(id);
res.redirect(`/show/${id}`);
}))



//$ READ 
route.get('/find', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("home", {
        campgrounds
    });
}))

route.get('/show/:id', catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const showCampGround = await Campground.findById(id);
    res.render("showCampground", {
        showCampGround
    });
}))


//$ UPDATE 

route.get('/editcampground/:id/edit', catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const editCampGround = await Campground.findById(id);
    res.render('editCampground', {
        editCampGround
    })
}))

//@ validationFunction middleware is used so that server side validation is done before saving to the database 
route.put('/editcampground/:id', campgroundValidationFunction, catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndUpdate(
        id, {
        title: req.body.title,
        location: req.body.location,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
    }
    );
    res.redirect(`/show/${id}`);
}))


//$ DELETE

route.delete('/editcampground/:id', catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/find');
}))



//@ This route handles express errors whenever the routes are invalid or does'nt match
route.all('*', catchAsync(async (req, res, next) => {
    throw new ExpressError('Not Found!!', 404);
}))


//$ Error handling middleware 
route.use((err, req, res, next) => {
    //@ Setting default values if err.status and err.msg is not specified by default
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = 'Something Wrong';
    res.render('error', {
        err
    });
})





module.exports = route;