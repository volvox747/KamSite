//@ Importing Campground Model
const Campground = require("./model/campground");





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


module.exports={isLoggedIn,isAuthor};
