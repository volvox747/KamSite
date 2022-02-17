const mongoose = require("mongoose");
const express = require('express');



//@ Importing campgroundSchema model
const Campground = require('../model/campground'); 
const route=express.Router();


//@ CREATE

route.get('/newcampground',(req,res)=>{
    res.render('newCampground');
})

route.post('/newcampground/create',async (req,res)=>{
    console.log(req.body);
    const newCampGround=new Campground({title:req.body.title,location:req.body.location,price:req.body.price,image:req.body.image,description:req.body.description});
    await newCampGround.save();
    res.redirect(`/show/${newCampGround._id}`);
})


//@ READ 
route.get('/find',async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("home",{campgrounds});
})

route.get('/show/:id',async (req,res)=>{
    const {id}=req.params;
    const showCampGround=await Campground.findById(id);
    res.render("showCampground",{showCampGround});
})


//@ UPDATE 

route.get('/editcampground/:id/edit',async (req,res)=>{
    const {id}=req.params;
    const editCampGround=await Campground.findById(id);
    res.render('editCampground',{editCampGround})
})

route.put('/editcampground/:id',async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndUpdate(id,{title:req.body.title,location:req.body.location});
    res.redirect(`/show/${id}`);
})


//@ DELETE

route.delete('/editcampground/:id',async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/find');
})







// route.get('/createpost',async (req,res)=>{
//     const samplePost = await new Campground({
//       title: "Wayanad",
//       price: "$30",
//       description:"Good Place"
//     });
//     samplePost.save().then(() => {
//         console.log("Successfully saved");
//         res.json(samplePost);
//     }).catch((err) => {
//         console.log(new Error(err).message, res.statusCode);
//     });
// })


// route.delete('/:postId',async (req,res)=>{
//     const {postId}=req.params;
//     console.log(postId);
//     const delPost=await Campground.findByIdAndDelete(postId);
//     res.json(delPost);
// })


module.exports=route;


