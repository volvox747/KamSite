const mongoose = require('mongoose');
const Review = require('./review');
const User=require('./user');

const Schema=mongoose.Schema;

const campgroundSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    images:[
    {
        url:String,
        filename:String
    }
    ],
    // This is for showing that the particular user created the campground 
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'                                 // One to Many Relationship
        }
    ]
});

campgroundSchema.post('findOneAndDelete',async (campground)=>{
    if(campground.reviews.length!=0)
    {
        await Review.deleteMany({_id:{$in:campground.reviews}});
    }
})
module.exports=mongoose.model('Campground',campgroundSchema);