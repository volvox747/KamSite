const isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.flash('error','You are not logged in');
        res.redirect('/login');
    }
    next();
}

module.exports=isLoggedIn;