
//@ Importing Campground Model
const Campground = require("../model/campground");

const mapBoxToken=process.env.MAPBOX_TOKEN;

//@ Importing Geocoding mapbox services 
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder=mbxGeoCoding({accessToken:mapBoxToken}) //contains frwd and reverse geocoding


const showNewCampGround = (req, res) => {
res.render("newCampground");
}

//* This route creates a new campground

const postNewCampGround = async (req, res) => 
{
    const geoData=await geocoder.forwardGeocode({
        query:req.body.location,// this takes the location string and gives the geocoding of it
        limit:1
    }).send();

    //^ adds new campground data entered by user into the campground collection in kam-site database 
    const newCampGround = new Campground({
        title: req.body.title,
        location: req.body.location,
        price: req.body.price,
        images: req.files.map(file=>({url:file.path,filename:file.filename})), //^ stores the file url and filename of uploaded files
        description: req.body.description,
        geometry:geoData.body.features[0].geometry
    });
    //^ adds the user who created the campground 
    let ans = req.user._id.toString(); //^ req.user._id will be in new ObjectId('5345363c453453') format which cannot be inserted into mongoDB
    newCampGround.author = ans; //^ this registers the id of the user which is created on registering the website
    await newCampGround.save(); //^ saves the data into camground collection 
    console.log(newCampGround);
    req.flash("success", "Successfully created a new campground!!"); //^ displays a success msg after creating a campground
    res.redirect(`/campground/show/${newCampGround._id}`); //^ redirects the control to showcamground page
}


const index = async (req, res) => {
    const campgrounds = await Campground.find({}); // returns all the campgrounds from the database
    res.render("home", {
        campgrounds,
    });
}


const showCampGround = async (req, res) => {
    const {
        id
    } = req.params; //^ destructure id from params
    const showCampGround = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {              //^ populates review and their correspondent authors
                path: 'author',
                model: 'User'
            }
        })
        .populate("author"); //^ this populates the campground's author/user
    res.render("showCampground", {
        showCampGround,
    });
}


const getUpdateCampGround = async (req, res) => {
    const {
        id
    } = req.params;
    const editCampGround = await Campground.findById(id); //^ finds the particular campground using id from the url
    res.render("editCampground", {
        editCampGround,
    });
}

const updateCampGround = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location, // this takes the location string and gives the geocoding of it
        limit: 1
    }).send();

    const {
        id
    } = req.params;
    const updateCampGround=await Campground.findByIdAndUpdate(id, {
        title: req.body.title,
        location: req.body.location,      //^ find the campground by id from the params
        price: req.body.price,            //^ updates the data given by the user
        description: req.body.description,
    });
    console.log(geoData.body.features[0].geometry);
    updateCampGround.geometry = geoData.body.features[0].geometry
    const imgs = req.files.map(file => ({
            url: file.path,
            filename: file.filename
        })) //^ stores the file url and filename of uploaded files
    updateCampGround.images.push(...imgs)//^spreading the imgs array and pushing onto the imgs column
    await updateCampGround.save();
    console.log(req.body.deleteImages);
    if(req.body.deleteImages) // the reason why we dont type deleteImages.length is length wont be defined
    {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await Campground.findByIdAndUpdate(id,{$pull:{images:{filename:{$in:req.body.deleteImages}}}}) //^ it removes the images which match the 'filename' values of 'deleteImages' array from the 'images' Array 
    }
    console.log(updateCampGround);
    req.flash("success", "Successfully edited the existing campground");
    res.redirect(`/campground/show/${id}`);
    
}


const deleteCampGround = async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndDelete(id);  //^ deletes a campground using id from the params
    req.flash("error", "Deleted a Campground");
    res.redirect("/campground/find");
}

module.exports = {
    index,
    showNewCampGround,
    postNewCampGround,
    showCampGround,
    getUpdateCampGround,
    updateCampGround,
    deleteCampGround
};