//@ Importing "Express" and assigning top level 'express() class' to 'app' variable 
const express = require("express");
const app = express();


//@ Importing common Async-Error handling wrapper function to handle async errors and Custom Error class  
const catchAsync = require('./utils/catchAsyncError');
const ExpressError = require('./utils/ExpressError');


//@ Importing ejs-mate and using it has a template engine
const ejsMate=require('ejs-mate');
app.engine('ejs',ejsMate);  


//@ To accept data from "forms" we use this middleware,if not the req.body will 'undefined' 
app.use(express.urlencoded({extended:true}))


//@ Importing and using 'express-session'  and setting a session
const session = require('express-session');
app.use(session({
  secret:'kamsite',
  resave:false,
  saveUninitialized:true
})); 



//@ Importing passport-local-mongoose and passport
  //` authentication middleware for node.js
const passport = require('passport');
  //` LocalStrategy is one of the strategies used for login purpose, 
  //` It authenticates manually typed username and password(local login) 
const LocalStrategy = require("passport-local");

//@ To use Passport in an Express or Connect-based application, configure it with the required passport.initialize() middleware
app.use(passport.initialize());

//@ To make the user logged-in unless he manually logs out (in other words persistent login sessions) use passport.session() middleware
app.use(passport.session());

//@ Importing User model and authenticating the user using local strategy
const User=require('./model/user')
passport.use(new LocalStrategy(User.authenticate()));
//@ add the user to the session data
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





//@ Importing m'method-override' pck to do additional request such as PUT,PATCH,DELETE 
const methodOverride = require('method-override');
app.use(methodOverride('_method'));




//@ Importing "Mongoose" and Connecting to "MongoDB" 
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/kam-site").then(() => {
  console.log("Connected to MongoDB");
}).catch(e=>{new Error(e).message})




//@ Importing "path" in-build module and Setting the views and view engine 
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



//@ Importing and using 'flash as a middleware
const flash=require('connect-flash');
app.use(flash());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error=req.flash("error");
  next();
})


//@ Importing route and using as a middleware 
const user=require('./routes/user');
app.use('/',user);

const campground = require("./routes/makeCampground");
app.use('/campground',campground);

const review=require('./routes/makeReview');
app.use('/review',review);








//@ This route handles express errors whenever the routes are invalid or does'nt match
app.all('*', catchAsync(async (req, res, next) => {
    throw new ExpressError('Not Found!!', 404);
}))


//$ Error handling middleware 
app.use((err, req, res, next) => {
    //@ Setting default values if err.status and err.msg is not specified by default
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = 'Something Wrong';
    res.render('error', {
        err
    });
})



//@ Connecting the server 
app.listen(3000, () => {
  console.log("Connected to server 3000");
});
