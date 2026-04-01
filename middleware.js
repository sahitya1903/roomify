const Listing = require("./models/listing");
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema,reviewSchema}=require('./schema.js');

module.exports.isLoggedIn=(req,res,next)=>{
    //save redirect url when user is not logged in
    // console.log(req.path,'..',req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error','You must be logged in to create listing.');
        return res.redirect('/login');
    }
    next();
}

//needed bcz passport resets redirectUrl value everytime user login successful 
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

//Authorization middleware
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error',"You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//Listing Schema Validation Middleware
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,errMsg);
    }
    next();
}

//Review Schema Validation Middleware
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,errMsg);
    }
    next();
}