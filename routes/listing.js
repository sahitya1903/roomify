const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner, validateListing}=require('../middleware.js');
const listingController=require('../controllers/listing.js');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


router.route('/')
    .get(wrapAsync(listingController.index))
    // .post(isLoggedIn,validateListing,
    // wrapAsync(listingController.createListing));
    .post(upload.single('listing[image]'),(req,res)=>{
        res.send(req.file);
    })

//NEW Route
router.get('/new',isLoggedIn,listingController.renderNewForm);

router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//EDIT Route 
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

module.exports=router;