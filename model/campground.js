const mongoose = require('mongoose');
const Review = require('./review');

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

campgroundSchema.post('findOneAndDelete',async (campground)=>{
    if(campground.reviews.length!=0)
    {
        await Review.deleteMany(_id,{$in:campground.reviews});
    }
})
module.exports=mongoose.model('Campground',campgroundSchema);