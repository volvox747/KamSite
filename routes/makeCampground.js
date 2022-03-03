const express = require('express');
const route = express.Router();


//@ Importing campgroundValidationSchema to validate the campground data or server side validation  
const {campgroundValidationSchema}=require('../schemas');


//@ Importing common Async-Error handling wrapper function to handle async errors and Custom Error class  
const catchAsync = require('../utils/catchAsyncError');
const ExpressError = require('../utils/ExpressError');

//@ Importing Campground Model
const Campground = require('../model/campground');
 

//@ Importing isLoggedIn middleware
const {isLoggedIn}=require('../middleware'); 



//@ CampGround Validation Function 

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






//$ CREATE

route.get('/newcampground', isLoggedIn, catchAsync((req, res) => {
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
    let ans=req.user._id.toString();//req.user._id will be in new ObjectId('5345363c453453') format which cannot be inserted into mongoDB
    newCampGround.author=ans; //$ this registers the id of the user which is created on registering the website
    await newCampGround.save();
    req.flash('success',"Successfully created a new campground!!")
    res.redirect(`/campground/show/${newCampGround._id}`);

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
    const showCampGround = await Campground.findById(id).populate('reviews').populate('author');
    res.render("showCampground", {
        showCampGround
    });
}))


//$ UPDATE 

route.get('/editcampground/:id/edit',isLoggedIn, catchAsync(async (req, res) => {
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
    req.flash('success','Successfully edited the existing campground')
    res.redirect(`/campground/show/${id}`);
}))


//$ DELETE

route.delete('/editcampground/:id',isLoggedIn, catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("error", "Deleted a Campground");
    res.redirect("/campground/find");
}))





module.exports = route;