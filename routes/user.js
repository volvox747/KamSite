const express = require("express");
const route = express.Router({ mergeParams: true });


//@ Importing User Model
const User = require('../model/user');


route.get('/register',async(req,res)=>{
    res.render('register');
})



module.exports=route;