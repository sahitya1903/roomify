const express=require('express');
const router=express.Router();
const Listing=require('../models/listing.js');
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {listingSchema}=require('../schema.js');
const {isLoggedIn}=require('../middleware.js');


//Listing Schema Validation Middleware
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//INDEX Route
router.get('/',wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render('./listings/index.ejs',{allListings});
}))

//NEW Route
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('./listings/new.ejs'); 
})

//CREATE Route
router.post('/',isLoggedIn,validateListing, wrapAsync(async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash('success','New Listing Created!');
    res.redirect('/listings');
}))


//SHOW Route
router.get('/:id',wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate('reviews').populate('owner');
    if(!listing){
        req.flash('error','listing you requested does not exist');
        return res.redirect('/listings');
    }
    console.log(listing);
    res.render('./listings/show.ejs',{listing});
}))


//EDIT Route
router.get('/:id/edit',isLoggedIn,wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash('error','listing you requested does not exist');
        return res.redirect('/listings');
    }
    res.render('./listings/edit.ejs',{listing});
}))

//UPDATE Route
router.put('/:id',isLoggedIn,validateListing,wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect('/listings');
}))

//DESTROY Route
router.delete('/:id',isLoggedIn,wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success','Listing Deleted!');
    res.redirect('/listings');
}))

module.exports=router;