const mongoose = require('mongoose');
const review = require('./review');

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
    image:{
        type:String,
        required:true
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'                                 // One to Many Relationship
        }
    ]
});

module.exports=mongoose.model('Campground',campgroundSchema);