const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const {validateReview, isLoggedIn, isReviewAuthor}=require('../middleware.js');
const reviewController=require('../controllers/review.js');

//ADD Review Route
router.post("/",validateReview,wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;