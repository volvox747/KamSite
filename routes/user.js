const express = require("express");
const route = express.Router({ mergeParams: true });


const catchAsync = require("../utils/catchAsyncError");

//@ Importing User Model
const User = require('../model/user');


route.get('/register',async(req,res)=>{
    res.render('register');
})

route.post('/register',catchAsync(async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const user=new User({username,email});
        const ans=await User.register(user,password);
        console.log(ans)
        req.flash('success',"Welcome to KamSite")
        res.redirect('/campground/find');
    }
    catch(err)
    {
        req.flash('error',err.message);
        res.redirect('/register')
    }
}))

module.exports=route;