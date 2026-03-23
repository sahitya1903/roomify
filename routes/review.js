const express=require('express');
const router=express.Router({mergeParams:true});
const Listing=require('../models/listing.js');
const Review=require('../models/review.js');
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {reviewSchema}=require('../schema.js');


//Review Schema Validation Middleware
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//ADD Review Route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing.id}`);
}))

//Delete Review Route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}}); ///delete review object id from listing array
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

module.exports=router;