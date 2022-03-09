const mongoose = require('mongoose');
const Review = require('./review');
const User=require('./user');

const Schema=mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
})
//^ why we store image seprately is the stored image must be stored in a cropped formt 
imageSchema.virtual('thumbnail').get(function (){ // virtual is a property which wont be stored in mongoDB
    return this.url.replace('/upload', '/upload/c_scale,w_150');
})

const campgroundSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    geometry:{ // this is how we store GeoJSON in campground
        type:{  //geoJSOn will be in {type:'Point',coordinates:[76.876,10.4545]} format 
            type:String, 
            enum:['Point'],   // this is done inorder to store the type:Point
            required:true    // this means that the type should only be of 'Point' string
        },
        coordinates:{
            type:[Number], // stores arr of nos
            required:true
        }
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
    images:[imageSchema], // stores the url and filename of images stored in image schema database
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

campgroundSchema.virtual('properties.popUp').get(function () { // virtual is a property which wont be stored in mongoDB
    return 'Hi I am Benson Thomas.'
})

campgroundSchema.post('findOneAndDelete',async (campground)=>{
    if(campground.reviews.length!=0)
    {
        await Review.deleteMany({_id:{$in:campground.reviews}});
    }
})
module.exports=mongoose.model('Campground',campgroundSchema);