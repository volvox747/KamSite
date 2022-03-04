//@ Importing Campground Model
const Campground = require("./model/campground");

//@ Importing campgroundValidationSchema and reviewValidationSchema to validate the campground data and reviews data or server side validation
const {campgroundValidationSchema, reviewValidationSchema} = require("./schemas");

const ExpressError = require("./utils/ExpressError");




//* To check whether the user is loggedIn before accessing newcamground page

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // checks whether user is authenticated or not
    req.session.returnTo = req.originalUrl; // returns the current url where the the process was interrupted
    req.flash("error", "You are not logged in");
    return res.redirect("/login"); // if you dont use "return" it will cause can't set header after they are send to client
  }
  next();
};



//* To check if someone access the edit,delete route through url
const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to update");
    return res.redirect(`/campground/show/${id}`);
  }
  next();
};




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



//@ Review Validation Function 

const reviewValidationFunction = (req, res, next) => {

  //@ validating the incoming data using the above defined model
  const validatedResult = reviewValidationSchema.validate(req.body);

  //@ destructuring the "error" object to handle any server side errors
  const {
    error
  } = validatedResult;

  //@ if any error take the "details"(array of objs) value inside the error object
  if (error) {
    //@ using "map" to map the object's msg from details
    //@ using "join" to join, if there are more than 1 msg
    const msg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};



module.exports = {
  isLoggedIn,
  isAuthor,
  campgroundValidationFunction,
  reviewValidationFunction
};
