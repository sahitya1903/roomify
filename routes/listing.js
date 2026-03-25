const express=require('express');
const router=express.Router();
const Listing=require('../models/listing.js');
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {listingSchema}=require('../schema.js');


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
router.get('/',wrapAsync(async (req,res,next)=>{
    const allListings=await Listing.find({});
    res.render('./listings/index.ejs',{allListings});
}))

//NEW Route
router.get('/new',(req,res,next)=>{
    res.render('./listings/new.ejs')    
})

//CREATE Route
router.post('/',validateListing, wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    req.flash('success','New Listing Created!');
    res.redirect('/listings');
}))


//SHOW Route
router.get('/:id',wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate('reviews');
    if(!listing){
        req.flash('error','listing you requested does not exist');
        return res.redirect('/listings');
    }
    res.render('./listings/show.ejs',{listing});
}))


//EDIT Route
router.get('/:id/edit',wrapAsync(async(req,res,next)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash('error','listing you requested does not exist');
        return res.redirect('/listings');
    }
    res.render('./listings/edit.ejs',{listing});
}))

//UPDATE Route
router.put('/:id',validateListing,wrapAsync(async(req,res,next)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect('/listings');
}))

//DESTROY Route
router.delete('/:id',wrapAsync(async(req,res,next)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success','Listing Deleted!');
    res.redirect('/listings');
}))

module.exports=router;