const Listing=require('../models/listing');

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render('./listings/index.ejs',{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render('./listings/new.ejs'); 
}

module.exports.createListing=async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash('success','New Listing Created!');
    res.redirect('/listings');
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:'reviews',populate:{path:'author'}})
    .populate('owner');
    if(!listing){
        req.flash('error','listing you requested does not exist');
        return res.redirect('/listings');
    }
    console.log(listing);
    res.render('./listings/show.ejs',{listing});
}

module.exports.renderEditForm=async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash('error','listing you requested does not exist');
        return res.redirect('/listings');
    }
    res.render('./listings/edit.ejs',{listing});
}

module.exports.updateListing=async(req,res)=>{
    const {id}=req.params;
    let listing=await Listing.findById(id);
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect('/listings');
}

module.exports.destroyListing=async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success','Listing Deleted!');
    res.redirect('/listings');
}