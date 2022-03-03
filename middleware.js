module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo=req.originalUrl;
    req.flash("error", "You are not logged in");
    return res.redirect("/login"); // if you dont use "return" it will cause can't set header after they are send to client
  }
  next();
};