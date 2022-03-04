
//@ Importing Campground Model and Review Model
const Campground = require('../model/campground');
const Review = require("../model/review");



const postReview = async (req, res) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findById(id); //^ finding a campground using id 
    const review = new Review(req.body); //^ adding data from the user to the review collection in the database
    let ans = req.user._id.toString(); //^ req.user._id will be in new ObjectId('5345363c453453') format which cannot be inserted into mongoDB
    review.author = ans; //^ adding user's id to review collection
    await review.save(); //^ saving review data
    campground.reviews.push(review); //^ adding saved review data to campground collection
    await campground.save(); //^ saving campground data
    req.flash('success', "Created a new Review!!");
    res.redirect(`/campground/show/${id}`);
}


const deleteReview = async (req, res) => {
    const {
        campid,
        revid      //^ destructuring campground id and review id from url
    } = req.params;
    await Campground.findByIdAndUpdate(campid, { //^ removing a review from specific camground
        $pull: {
            reviews: revid //^ $pull removes the reviews from the particular campground
        }
    });
    await Review.findByIdAndDelete(revid); //^ deleting the review
    req.flash('error', "Deleted a Review"); //^ displays a alert stating "deleted a review"
    res.redirect(`/campground/show/${campid}`);
}

module.exports={postReview,deleteReview};