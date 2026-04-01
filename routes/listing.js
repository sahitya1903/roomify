const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner, validateListing}=require('../middleware.js');
const listingController=require('../controllers/listing.js');

//INDEX Route
router.get('/',wrapAsync(listingController.index));

//NEW Route
router.get('/new',isLoggedIn,listingController.renderNewForm);

//CREATE Route
router.post('/',isLoggedIn,validateListing, wrapAsync(listingController.createListing))

//SHOW Route
router.get('/:id',wrapAsync(listingController.showListing))

//EDIT Route
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

//UPDATE Route
router.put('/:id',isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))

//DESTROY Route
router.delete('/:id',isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

module.exports=router;